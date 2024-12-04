import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiter to prevent API rate limit errors
class RateLimiter {
    private lastRequestTime: number = 0;
    private readonly MIN_INTERVAL_MS = 1000; // Minimum 1 second between requests

    async wait() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.MIN_INTERVAL_MS) {
            await new Promise((resolve) =>
                setTimeout(resolve, this.MIN_INTERVAL_MS - timeSinceLastRequest)
            );
        }

        this.lastRequestTime = Date.now();
    }
}

const rateLimiter = new RateLimiter();

// Formatting function for the prompt
async function formatResult(
    cvText: string,
    jobDetail: string
): Promise<string> {
    return `
  - Dựa vào thông tin CV mà tôi cung cấp và những yêu cầu của job detail để đưa ra đánh giá với 4 mức độ:
  - Đây là kết quả mà tôi muốn bạn trả về:
    + priority (CV xuất sắc, đáp ứng hoặc vượt quá hầu hết các yêu cầu)
    + potential (CV tốt, đáp ứng một số yêu cầu quan trọng)
    + suitable (CV có các kĩ năng ổn và có thể học trong quá trình làm việc)
    + not_suitable (CV chưa đáp ứng đủ các yêu cầu cần thiết)
  ->  Trả lời ngắn gọn, chỉ cần trả về một trong bốn mức đánh giá trên.

  - Thông tin CV:
  {
    ${cvText}
  }

  - Thông tin Job Detail:
  {
    ${jobDetail}
  }
  `;
}

// Main evaluation function
export async function evaluateCV(
    cvText: string,
    description: string
): Promise<string> {
    try {
        // Wait to prevent rate limiting
        await rateLimiter.wait();

        // Initialize the model
        const genAI = new GoogleGenerativeAI('AIzaSyCnda9UdqzRUMSssqfhLU-aU-5Hz5jUw5Y');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Prepare and generate content
        const prompt = await formatResult(cvText, description);
        const result = await model.generateContent(prompt);

        // Extract and return response
        const response = await result.response;
        const evalResult = response.text().trim().toLowerCase();

        // Validate response
        const validResults = [
            'priority',
            'potential',
            'suitable',
            'not_suitable',
        ];
        if (validResults.includes(evalResult)) {
            return evalResult;
        } else {
            throw new Error('Invalid evaluation response');
        }
    } catch (error) {
        // Enhanced error handling
        console.error('CV Evaluation Error:', error);
        throw error;
    }
}

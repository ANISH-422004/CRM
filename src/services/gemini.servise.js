const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports.getScore = async (leadData) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_SECRET_KEY);

    const systemInstruction = `
      You are a lead scoring assistant for a CRM application.

      Your job is to assign a score between 1 and 100 to a sales lead, based on the following input fields:

      - Name
      - Email
      - Company
      - Status (one of: NEW, CONTACTED, CONVERTED)
      - CreatedAt (date)
      - UpdatedAt (date)

      Scoring Rules:

      1. Base Score by Status:
        - CONVERTED → base score: 90
        - CONTACTED → base score: 60
        - NEW       → base score: 30

      2. Adjust score using rules:
        - If the email domain is from a well-known company (like "@google.com", "@microsoft.com", "@amazon.com"), add +5.
        - If "createdAt" is older than 30 days and status is still NEW, subtract -10.
        - If the name or company includes "CEO", "Founder", or "Director", add +5.
        - Final score must be between 1 and 100.

    outPut : 

     10 or 20 0r 90

    `;
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction,
    });


    const userPrompt = `
      Lead Information:
      Name: ${leadData.name}
      Email: ${leadData.email}
      Company: ${leadData.company}
      Status: ${leadData.status}
      CreatedAt: ${leadData.createdAt}
      UpdatedAt: ${leadData.updatedAt}

      Please provide the lead score based on the rules.
    `;

    const response = await model.generateContent(userPrompt);

   return response.response.text()
  } catch (error) {
    console.error("Error in getScore:", error);
    throw error;
  }
};

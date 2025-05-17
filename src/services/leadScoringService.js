const { getScore } = require("./gemini.servise");

exports.getLeadScore = async (lead) => {

  const score = await getScore(lead);  // await here!
  
  
  return score;
};

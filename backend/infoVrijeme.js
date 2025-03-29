const vrijemeLog = (req, res, next) => {
    const vrijeme = new Date();
    console.log(`Vrijeme: ${vrijeme.toISOString()}`);
    next();
   };
   
   module.exports = vrijemeLog;
   
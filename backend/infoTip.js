const tipLog = (req, res, next) => {
    console.log(`Tip zahtjeva: ${req.method}`);
    next();
   };
   
   module.exports = tipLog;
   
const adresaLog = (req, res, next) => {
    console.log(`Adresa zahtjeva: ${req.path}`);
    next();
   };
   
   module.exports = adresaLog;
   
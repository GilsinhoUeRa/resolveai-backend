// src/routes/auth.routes.js (Versão de Depuração)
const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', authController.login);

// --- MIDDLEWARE DE DEPURAÇÃO ADICIONADO ---
// Este middleware irá executar antes do Passport e imprimir informações cruciais.
const debugGoogleAuth = (req, res, next) => {
    console.log("==========================================================");
    console.log("INICIANDO DEPURAÇÃO DA ROTA DE AUTENTICAÇÃO COM GOOGLE");

    // A biblioteca do Passport constrói o URL de callback completo aqui.
    // Vamos aceder-lhe para ver o que está a ser gerado.
    const strategy = passport._strategy('google');
    if (strategy && strategy._callbackURL) {
        // Constrói o URL completo tal como o Passport o faria
        const protocol = req.protocol;
        const host = req.get('host');
        const fullCallbackURL = `${protocol}://${host}${strategy._callbackURL}`;

        console.log("URL de Callback que será enviado para o Google:", fullCallbackURL);
    } else {
        console.log("Não foi possível aceder à estratégia do Passport para depuração.");
    }
    console.log("==========================================================");

    // Continua para a lógica normal do Passport
    next();
};

// Rota de Início da Autenticação com Google (agora com o nosso debug)
router.get('/google',
  debugGoogleAuth, // <-- O nosso middleware é executado primeiro
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// Rota de Callback do Google (permanece a mesma)
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  authController.googleCallback
);

module.exports = router;
// src/config/passport.config.js (Versão Final e Corrigida)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./kysely'); // A nossa instância do Kysely

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Esta função é o coração da autenticação via Google.
    // Ela é chamada após o Google confirmar a identidade do utilizador.
    const email = profile.emails[0].value;

    try {
      // 1. Procura um utilizador na nossa base de dados com o email fornecido pelo Google.
      const usuario = await db.selectFrom('usuarios')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();

      if (usuario) {
        // 2. Se o utilizador JÁ EXISTE, o fluxo está completo.
        // Passamos o objeto 'usuario' do nosso banco de dados para o Passport.
        // O 'null' indica que não houve erro.
        return done(null, usuario);
      } else {
        // 3. Se o utilizador NÃO EXISTE, este é o seu primeiro login.
        // Não o criamos aqui. Em vez disso, criamos um objeto temporário
        // com os dados do Google para enviar ao nosso controller.
        const newUserProfile = {
          isNew: true, // Sinalizador crucial para a nossa lógica no controller
          email: email,
          nome: profile.displayName,
          foto_url: profile.photos[0].value
        };
        // Passamos este perfil temporário para o Passport.
        return done(null, newUserProfile);
      }
    } catch (error) {
      // Em caso de erro de base de dados, sinalizamos ao Passport.
      console.error("Erro na estratégia Google do Passport:", error);
      return done(error, null);
    }
  }
));

// Estas funções são usadas pelo Passport para gestão de sessão,
// mas como usamos JWT (stateless), elas têm um papel menor.
// Manter esta estrutura é uma boa prática.
passport.serializeUser((user, done) => {
  // Apenas o ID é suficiente, pois podemos buscar o resto na base de dados.
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    // Se o ID for indefinido (como no caso do nosso newUserProfile que ainda não tem ID),
    // simplesmente passamos nulo para evitar um erro de base de dados.
    if (!id) {
        return done(null, null);
    }
    try {
        const user = await db.selectFrom('usuarios').selectAll().where('id', '=', id).executeTakeFirst();
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
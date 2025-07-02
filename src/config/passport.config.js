// src/config/passport.config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./kysely'); // A nossa instância do Kysely

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback" // O mesmo Redirect URI que configurou na Google Cloud
  },
  async (accessToken, refreshToken, profile, done) => {
    // Esta função é chamada quando o Google redireciona de volta com sucesso.
    // 'profile' contém os dados do utilizador do Google.
    console.log('Perfil recebido do Google:', profile);

    const email = profile.emails[0].value;
    const nome = profile.displayName;
    const foto_url = profile.photos[0].value;

    try {
      // 1. Verifica se o utilizador já existe na nossa base de dados
      let usuario = await db.selectFrom('usuarios')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();

      // 2. Se não existir, cria um novo utilizador
      if (!usuario) {
        console.log(`Utilizador com email ${email} não encontrado. A criar novo utilizador.`);
        // Nota: Para o registo, precisamos de mais dados (tipo_pessoa, documento, etc.)
        // Esta é uma implementação simplificada. Uma implementação real poderia
        // redirecionar para uma segunda página de registo para completar o perfil.
        usuario = await db.insertInto('usuarios')
          .values({
            nome: nome,
            email: email,
            foto_url: foto_url,
            // Valores padrão para os campos obrigatórios
            senha: '', // A senha não é necessária para login social
            tipo_pessoa: 'PF',
            documento: '', // Documento pode ser solicitado depois
          })
          .returningAll()
          .executeTakeFirstOrThrow();
      }

      // 3. Retorna o nosso objeto de utilizador para o Passport
      // O 'null' significa que não houve erro.
      done(null, usuario);

    } catch (error) {
      console.error("Erro na estratégia Google do Passport:", error);
      done(error, null);
    }
  }
));

// Estas funções não são estritamente necessárias para uma API JWT stateless,
// mas são boas práticas para o Passport.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.selectFrom('usuarios').selectAll().where('id', '=', id).executeTakeFirst();
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
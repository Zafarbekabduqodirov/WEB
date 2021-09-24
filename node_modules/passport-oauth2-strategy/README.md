# Passport OAuth2 Strategy

This passport strategy is based in [passport-oauth2-client-password](https://github.com/jaredhanson/passport-oauth2-client-password) but **Client Secret** is only mandatory when the grant type is ***authorization_code***.

It's written in Typescript so if your library it's also using it you will be getting typings for free.

```
npm i -S passport-oauth2-strategy
```
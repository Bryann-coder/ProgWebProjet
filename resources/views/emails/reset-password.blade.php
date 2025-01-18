<!DOCTYPE html>
<html>
<head>
    <title>Réinitialisation de Mot de Passe</title>
</head>
<body>
    <h1>Réinitialisation de Mot de Passe</h1>
    <p>Bonjour {{ $user->nom }},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
    <a href="{{ $resetLink }}">Réinitialiser le Mot de Passe</a>
    <p>Si vous n'avez pas demandé la réinitialisation de votre mot de passe, veuillez ignorer cet email.</p>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <style>
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>Nouvelle demande de réservation</h1>
    <p>Bonjour {{ $stylist->user->nom }},</p>
    <p>Un client souhaite réserver une séance pour le {{ $date }}</p>
    <p>Détails du client:</p>
    <ul>
        <li>Nom: {{ $user->nom }}</li>
        <li>Email: {{ $user->email }}</li>
    </ul>
    
    <form method="POST" action="{{ url("/api/workdays/confirm/{$stylist->id}/{$user->id}/" . urlencode($date)) }}">
        <button type="submit" class="button">Confirmer la réservation</button>
    </form>
    
    <p>Merci de répondre rapidement à cette demande.</p>
</body>
</html>
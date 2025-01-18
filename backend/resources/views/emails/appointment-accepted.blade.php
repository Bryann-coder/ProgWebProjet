<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 5px;
            text-align: center;
            border-radius: 4px;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 4px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réservation Confirmée !</h1>
        </div>
        
        <div class="content">
            <p>Bonjour {{ $user->nom }},</p>
            
            <p>Nous sommes ravis de vous confirmer que votre réservation a été acceptée par votre styliste.</p>
            
            <h2>Détails de la réservation :</h2>
            <ul>
                <li><strong>Date :</strong> {{ $date }}</li>
                <li><strong>Styliste :</strong> {{ $stylist->user->nom }}</li>
            </ul>
            
            <p>Nous vous attendons avec impatience !</p>
            
            <p>Si vous avez besoin de modifier ou d'annuler votre réservation, veuillez nous contacter dès que possible.</p>
        </div>
        
        <div class="footer">
            <p>Merci de votre confiance !</p>
        </div>
    </div>
</body>
</html>
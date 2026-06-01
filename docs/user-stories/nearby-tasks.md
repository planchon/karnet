# User Story 008 - Taches autour de moi

L'utilisateur peut demander a Karnet de retenir une tache liee a un lieu ou a un type de lieu.

Par exemple:

- "Rappelle-moi d'acheter du dentifrice quand je passe devant une pharmacie."
- "Penser a deposer ce colis quand je suis pres de la poste."
- "Me rappeler de passer au pressing quand je suis dans le quartier."

Karnet comprend que le rappel ne depend pas seulement d'une heure, mais d'un contexte: la position, le lieu, l'ouverture probable du commerce, et parfois le moment de la journee.

Quand l'utilisateur passe pres du bon endroit, Karnet peut afficher la tache sur la home ou envoyer une notification si la tache est assez claire et utile maintenant.

## Display

Karnet affiche une carte avec:

- la tache a faire;
- le lieu ou type de lieu detecte;
- la distance approximative;
- l'etat d'ouverture si disponible;
- une action pour marquer comme fait, ignorer, reporter ou supprimer.

## Guardrails

Les notifications doivent rester rares. Karnet ne doit pas notifier plusieurs fois pour la meme tache dans une courte periode, et doit apprendre si l'utilisateur ignore souvent certains types de rappels geolocalises.

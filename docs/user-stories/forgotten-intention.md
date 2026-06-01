# User Story 011 - Relancer une intention oubliee

L'utilisateur sauvegarde parfois des envies ou des intentions sans date precise: essayer une activite, lire un article, ranger quelque chose, appeler quelqu'un, regarder un film, cuisiner une recette, ou visiter un lieu.

Karnet ne doit pas traiter ces intentions comme des rappels urgents. Il les garde en memoire et les fait remonter seulement quand le contexte semble favorable.

Par exemple, si l'utilisateur a sauvegarde "tester ce cafe un week-end" et qu'il est samedi, disponible, et proche du quartier, Karnet peut afficher l'idee sur la home.

Cette user story doit rester douce. Le but est de redonner vie a une intention, pas de creer une pression.

## Display

Karnet affiche une carte simple avec:

- l'intention sauvegardee;
- la raison courte pour laquelle elle revient maintenant;
- une action pour faire, garder pour plus tard, oublier ou corriger.

## Behavior

Par defaut, Karnet ne notifie pas pour ces intentions. Elles apparaissent principalement dans la home, sauf si l'utilisateur transforme explicitement l'intention en rappel.

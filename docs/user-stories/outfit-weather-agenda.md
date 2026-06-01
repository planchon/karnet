# User Story 004 - Tenue selon meteo et agenda

L'utilisateur peut sauvegarder des photos de tenues, des inspirations trouvees en ligne, ou des vetements qu'il possede deja.

Quand une tenue est ajoutee a Karnet, l'agent comprend le style general, la saison, le niveau de formalite, les couleurs, et les contraintes visibles comme manteau, chaussures ou accessoires.

Plus tard, quand l'utilisateur ouvre Karnet le matin, l'agent peut proposer une tenue adaptee a la meteo, a la temperature, et aux evenements du jour.

Par exemple, si l'utilisateur a un rendez-vous professionnel et qu'il pleut, Karnet peut faire remonter une tenue assez formelle avec veste et chaussures adaptees.

Karnet doit rester discret. Par defaut, cette suggestion vit dans la home. Une notification ne doit etre envoyee que si l'utilisateur a explicitement demande de l'aide pour s'habiller ou si un contexte important le justifie.

## Display

Karnet affiche une carte simple avec:

- une photo de la tenue ou de l'inspiration;
- la meteo utile pour la decision;
- le contexte qui rend la tenue pertinente;
- une action pour accepter, ignorer, sauvegarder ou corriger la suggestion.

## Learning

Si l'utilisateur indique qu'une suggestion ne correspond pas a son style, a la saison ou au niveau de formalite attendu, Karnet doit apprendre cette preference pour les prochaines fois.

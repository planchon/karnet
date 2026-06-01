# User Story 010 - Suivi administratif

L'utilisateur peut ajouter a Karnet une photo, un PDF, une capture d'ecran ou un document administratif: facture, garantie, ordonnance, feuille de soin, contrat, amende, billet, document d'assurance, ou justificatif.

Quand le document est ajoute, Karnet comprend le type de document, les dates importantes, les montants, les actions potentielles, et les risques d'oubli.

Par exemple, si l'utilisateur ajoute une facture avec une garantie de deux ans, Karnet peut retenir la date de fin de garantie. Si l'utilisateur ajoute une ordonnance renouvelable, Karnet peut proposer un rappel avant la fin du traitement.

Karnet ne doit pas agir automatiquement sur des sujets administratifs sensibles. Il peut preparer des suggestions, mais il demande confirmation avant d'envoyer un document, creer un rappel externe, ou remplir un formulaire.

## Display

Karnet affiche une carte administrative avec:

- le type de document;
- les dates importantes;
- l'action suggeree;
- le fichier source;
- un statut simple: a faire, en attente, termine, archive.

## Privacy

Ces documents peuvent contenir des informations sensibles. L'utilisateur doit pouvoir supprimer le document, retirer une information extraite, ou demander a Karnet de ne plus l'utiliser pour ses suggestions.

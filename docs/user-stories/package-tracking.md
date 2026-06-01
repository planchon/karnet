# User Story 013 - Suivi de colis

L'utilisateur peut donner a Karnet un numero de suivi pour un colis qu'il attend.

Karnet detecte le numero, essaie d'identifier le transporteur, puis cree un suivi de colis dans sa memoire. Si le transporteur n'est pas certain, Karnet peut demander une confirmation courte ou proposer plusieurs options.

Une fois le suivi cree, Karnet surveille l'evolution du colis et met a jour son statut dans l'application.

Par exemple, l'utilisateur peut envoyer:

- "Suis ce colis: 8X123456789FR"
- "Mon colis Amazon: 1Z999AA10123456784"
- une capture d'ecran contenant un numero de suivi;
- un lien de suivi partage depuis une app de livraison.

Karnet ne doit pas notifier a chaque scan logistique. Il notifie seulement quand l'information change vraiment ce que l'utilisateur doit savoir: livraison prevue aujourd'hui, colis livre, tentative echouee, colis en point relais, blocage, frais ou action necessaire.

## Display

Karnet affiche une carte colis avec:

- le nom ou contexte du colis si connu;
- le transporteur;
- le statut actuel;
- la derniere mise a jour utile avec date et lieu si disponible;
- l'estimation de livraison ou la fenetre prevue;
- une action pour ouvrir le suivi officiel, marquer comme recu, corriger le transporteur, mettre en pause ou supprimer le suivi.

## Behavior

Karnet peut verifier le statut du colis en arriere-plan, avec une frequence adaptee a l'etat du colis. Par exemple, un colis en transit peut etre verifie rarement, tandis qu'un colis annonce en livraison aujourd'hui peut etre verifie plus souvent.

Quand le colis est livre ou marque comme recu, Karnet arrete le suivi actif apres une courte periode de grace.

Si Karnet ne peut plus recuperer le statut, il garde la derniere information connue et affiche clairement que le suivi n'est plus a jour.

## Privacy

Un numero de suivi peut reveler des informations personnelles, comme une adresse approximative, un transporteur, un achat ou une habitude de livraison.

L'utilisateur doit pouvoir supprimer le suivi, retirer le nom du colis, ou demander a Karnet de ne plus utiliser ce colis dans ses suggestions. Si Karnet utilise un service externe de tracking, il doit etre clair que le numero de suivi peut etre transmis a ce service.

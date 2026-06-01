# Karnet

Karnet est mon assistant de vie discret, construit autour d'une idee simple:
reduire ma charge mentale en transformant ma memoire personnelle en actions
utiles au bon moment.

Ce n'est pas une app de notes, ni une base de donnees a organiser soi-meme,
ni un chatbot qui parle beaucoup. Karnet n'est pas d'abord un produit grand
public: c'est un assistant personnel, fait pour moi, qui peut etre imparfait au
debut mais qui doit devenir progressivement fiable, corrigeable et utile.

Karnet est une presence calme qui retient les choses importantes, fait des liens
entre elles, apprend mes routines, puis fait remonter ce qui devient pertinent.

## Vision

Karnet m'aide dans ma vie quotidienne.

Il peut retenir des restaurants, des recettes, des tenues, des personnes, des
idees, des rappels, des lieux, des colis, des photos ou des contenus partages depuis
d'autres applications. Avec mes permissions, il peut aussi utiliser certains
signaux personnels comme la position GPS, le calendrier ou les photos.

Le but n'est pas seulement de sauvegarder. Le but est que Karnet comprenne ce
qui a ete sauvegarde, pourquoi cela pourrait compter plus tard, et dans quel
contexte cela pourrait devenir utile.

Un bon moment Karnet ressemble a ceci:

> J'ai partage un Reel il y a trois semaines. Aujourd'hui, je passe
> dans le quartier au bon moment de la journee. Karnet fait remonter le
> restaurant sur la home. J'y vais.

Karnet doit donner le sentiment suivant:

> "Ah oui, exactement. Bien vu."

## Direction v0

La premiere version ne cherche pas a tout faire.

Elle doit construire une base saine:

- ingestion depuis Telegram et/ou l'application;
- memoire structuree, avec source, date, categorie, statut et niveau de
  confiance quand c'est utile;
- home simple avec des suggestions non intrusives;
- rappels explicites demandes par moi;
- correction naturelle quand Karnet se trompe.

Les notifications contextuelles avancees, comme les suggestions liees a la
position GPS, a la meteo, au calendrier ou a un moment precis de la journee,
viennent apres. Elles ne doivent arriver que quand la memoire est assez propre
et que les permissions sont clairement maitrisees.

## Principes

### Karnet est discret

Karnet doit parler peu. Sa voix est courte, directe, et utile.

Les notifications doivent rester rares. Elles sont reservees aux rappels
demandes, aux choses planifiees, ou aux informations vraiment importantes. La
home, en revanche, est l'espace ou Karnet peut etre proactif.

### Karnet est proactif

Karnet ne doit pas seulement attendre une question. Il peut proposer une action,
faire remonter une idee, rappeler une chose importante, ou mettre en avant une
information au bon moment.

Cette proactivite doit surtout vivre dans l'application, sur la home.

### Karnet transforme la memoire en action

Karnet ne ressort pas seulement des souvenirs. Il cherche ce que je peux faire
avec.

Une adresse peut devenir un restaurant a essayer. Une recette peut devenir un
repas pour ce soir. Une tenue peut devenir une suggestion selon la meteo ou un
evenement. Une information sur une personne peut devenir une chose a demander,
a dire, ou a ne pas oublier.

### Karnet apprend son proprietaire

Il n'y a pas de comportement universel par defaut. Karnet doit s'adapter a mes
routines, mes preferences, mes corrections et mes habitudes.

Si Karnet se trompe, je dois pouvoir lui dire naturellement ce qui ne va pas.
Karnet apprend de cette correction.

### Karnet demande avant d'agir dehors

Karnet peut organiser son propre espace librement. Il peut preparer des actions,
des suggestions ou des cartes dans l'application.

Mais des qu'une action modifie quelque chose en dehors de son environnement, il
demande mon autorisation. Par exemple: envoyer un message, reserver, creer un
evenement, modifier un document, ou declencher une action externe.

Les permissions doivent etre traitees comme un systeme de confiance, pas comme
un simple interrupteur. Karnet peut avoir le droit de lire une information sans
avoir le droit de notifier, et il peut avoir le droit de preparer une action sans
avoir le droit de l'executer.

### Karnet peut rester vide

La home n'a pas besoin d'etre remplie artificiellement. Si Karnet n'a rien
d'utile a montrer, un ecran calme ou vide est acceptable.

La home de Karnet doit etre meritee: elle se remplit quand l'assistant a compris
quelque chose d'actionnable.

## Home

La home est l'espace de Karnet.

Ce n'est pas un dashboard classique, ni une simple liste de notes. C'est une vue
vivante, legere et scrollable, ou Karnet choisit ce que je devrais voir
maintenant ou aujourd'hui.

Elle peut melanger:

- la todo list du jour;
- des restaurants ou lieux interessants;
- des recettes a essayer;
- des idees de tenues;
- des rappels lies a des personnes;
- des colis a suivre;
- des choses sauvegardees mais jamais utilisees;
- des suggestions liees a l'heure, la date, le lieu, la meteo ou les routines.

Les cartes doivent rester simples. Par defaut, elles ne donnent pas trop
d'explications. L'important est l'action proposee.

## Memoire

Karnet doit construire une memoire vivante.

Cette memoire peut contenir des choses que je partage volontairement, mais aussi
des informations captees automatiquement si je donne les permissions
necessaires.

Les domaines importants au depart sont:

- restaurants et adresses;
- recettes;
- tenues;
- personnes;
- rappels;
- colis;
- photos;
- Reels et contenus partages.

La memoire sociale est importante. Karnet doit pouvoir retenir des informations
sur les personnes: preferences, idees cadeaux, choses a demander, sujets a
suivre, promesses, souvenirs ou details utiles.

Quand je demande a Karnet d'oublier quelque chose, cela signifie au minimum que
Karnet ne doit plus utiliser cette information pour ses suggestions. Idealement,
Karnet doit aussi etre capable d'expliquer ce qu'il sait, d'ou ca vient, et ce
qu'il va oublier.

## Experience recherchee

Karnet doit me faire gagner du temps et eviter les oublis.

Je dois etre content de voir a quel point l'assistant est efficace.
Karnet reussit quand il donne l'impression que quelque chose d'utile a ete
prepare sans effort, au bon moment, avec peu de bruit.

Karnet pense aux choses a ma place, sans prendre trop de place.

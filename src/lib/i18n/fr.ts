export default {
  common: {
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
    signUp: "S'inscrire",
    schedule: 'sortie',
    schedules: 'sorties',
    diver: 'plongeur',
    divers: 'plongeurs',
    allBookings: 'Toutes les réservations',
    bookNewDive: 'Réserver une sortie',
    viewBoats: 'Voir les bateaux',
    bookNow: 'Réserver',
    confirmBooking: 'Confirmer la réservation',
    cancel: 'Annuler',
    save: 'Enregistrer',
    of: 'sur',
    welcome: 'Bienvenue, {name}',
    profile: 'Votre Profil',
    language: 'Langue',
    languages: {
      english: 'English',
      french: 'Français'
    },
    months: {
      january: 'Janvier',
      february: 'Février',
      march: 'Mars',
      april: 'Avril',
      may: 'Mai',
      june: 'Juin',
      july: 'Juillet',
      august: 'Août',
      september: 'Septembre',
      october: 'Octobre',
      november: 'Novembre',
      december: 'Décembre'
    },
    weekDays: {
      sunday: 'Dim',
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mer',
      thursday: 'Jeu',
      friday: 'Ven',
      saturday: 'Sam'
    },
    status: {
      confirmed: 'Confirmer',
      pending: 'En attente',
      canceled: 'Annuler',
      completed: 'Terminé',
      past: 'Passée',
      upcoming: 'A venir',
      active: 'Actif',
      inactive: 'Indisponible',
      maintenance: 'En maintenance'
    },
    roles: {
      member: 'Membre',
      admin: 'Administrateur'
    }
  },
  navbar: {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    boats: 'Bateaux',
    schedules: 'Sorties',
    bookings: 'Réservations',
    users: 'Utilisateurs',
    myBookings: 'Mes Réservations'
  },
  boats: {
    manageBoats: 'Gérer les bateaux',
    addNewBoat: 'Ajouter un bateau',
    editBoat: 'Modifier le bateau',
    deleteBoat: 'Supprimer le bateau',
    noDescription: 'Aucune description disponible',
    boatDetails: 'Détails du bateau',
    boatName: 'Nom du bateau',
    capacity: 'Capacité',
    description: 'Description',
    status: 'Statut',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirmDelete: 'Confirmer la suppression',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer ce bateau ?',
    availableBoats: 'Bateaux disponibles',
    noBoatsAvailable: 'Aucun bateau disponible',
    checkBackLater: 'Revenez plus tard pour voir les bateaux et sorties disponibles.',
    boatList: 'Liste des bateaux',
    actions: 'Actions',
    imageUrl: "URL de l'image",
    noBookings: 'Aucune réservation',
    bookedDates: 'Dates réservées',
    noBoats: 'Aucun bateau',
    addFirstBoat: 'Ajoutez votre premier bateau pour commencer.',
    upcomingSchedules: 'Sorties à venir',
    noUpcomingSchedules: 'Aucune sortie à venir',
    spotsLeft: 'places restantes',
    fullyBooked: 'Complet',
    title: 'Bateaux',
    createBoat: 'Créer un bateau',
    name: 'Nom',
    create: 'Créer',
    edit: 'Modifier',
    delete: 'Supprimer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce bateau ?',
    yes: 'Oui',
    no: 'Non',
    bookings: 'réservations',
    bookingsCount: 'Nombre de réservations'
  },
  boat: {
    capacity: 'Capacité',
    description: 'Description',
    upcomingSchedules: 'Prochaines sorties',
    noUpcomingSchedules: 'Aucune sortie à venir',
    bookNow: 'Réserver',
    spots: 'places',
    spotsLeft: '{count} places restantes',
    spotsFull: 'Complet',
    specifications: 'Spécifications',
    scheduleList: 'Liste des sorties',
    viewAll: 'Voir toutes les sorties'
  },
  schedules: {
    title: 'Sorties',
    boatSchedules: 'Sorties',
    addSchedule: 'Ajouter une sortie',
    editSchedule: 'Modifier la sortie',
    deleteSchedule: 'Supprimer la sortie',
    boat: 'Bateau',
    dateTime: 'Date et heure',
    startDateTime: 'Date et heure de début',
    endDateTime: 'Date et heure de fin',
    bookings: 'Réservations',
    actions: 'Actions',
    save: 'Enregistrer',
    cancel: 'Annuler',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer la sortie du {date} ?',
    createNewSchedule: 'Créer une nouvelle sortie',
    selectBoat: 'Sélectionner un bateau',
    selectABoat: 'Sélectionnez un bateau',
    date: 'Date',
    startTime: 'Heure de début',
    endTime: 'Heure de fin',
    upcomingSchedules: 'Sorties à venir',
    pastSchedules: 'Sorties passées',
    createSchedule: 'Créer la sortie',
    time: 'Horaire',
    availableSpots: 'Places disponibles',
    bookingFor: 'Réservation pour',
    noSchedules: 'Aucun créneau horaire disponible',
    addFirstSchedule: 'Ajoutez votre premier créneau',
    schedule: {
      date: 'Date',
      time: 'Heure',
      boat: 'Bateau',
      availableSpots: 'Places disponibles',
      details: 'Détails de la sortie'
    },
    noSchedulesYet: 'Aucune sortie pour le moment',
    schedulesWillAppear: 'Les sorties apparaîtront ici une fois créés',
    noActiveSchedules: 'Aucune sortie à venir',
    createNewToSee: 'Créez une nouvelle sortie pour la voir ici',
    noPastSchedules: 'Aucune sortie passée',
    pastSchedulesWillAppear: 'Les sorties passées apparaîtront ici',
    allFieldsRequired: 'Tous les champs sont obligatoires',
    endTimeMustBeAfterStart: "L'heure de fin doit être après l'heure de début",
    startTimeMustBeFuture: 'La date de début doit être dans le futur',
    editScheduleDescription:
      'Modifiez le créneau horaire en sélectionnant un nouveau bateau et/ou de nouveaux horaires.',
    currentSchedule: 'Créneau horaire actuel',
    hasBookings:
      '{count, plural, =0 {Aucune réservation} one {# réservation associée} other {# réservations associées}}'
  },
  bookings: {
    title: 'Mes réservations',
    myBookings: 'Mes Réservations',
    upcomingBookings: 'Réservations à venir',
    pastBookings: 'Réservations passées',
    noUpcomingBookings: 'Aucune réservation à venir',
    upcomingBookingsWillAppear: 'Les réservations à venir apparaîtront ici',
    noPastBookings: 'Aucune réservation passée',
    pastBookingsWillAppear: 'Les réservations passées apparaîtront ici',
    noBookingsYet: 'Aucune réservation pour le moment',
    bookingsWillAppear: 'Vos réservations apparaîtront ici une fois que vous en aurez créé.',
    startBooking: 'Commencez par réserver une plongée parmi nos sorties disponibles',
    bookedBy: 'Réservé par',
    cancelBooking: 'Annuler la réservation',
    cancelConfirmation: 'Êtes-vous sûr de vouloir annuler cette réservation ?',
    editBooking: 'Modifier la réservation',
    editBookingDescription: 'Modifiez votre réservation en choisissant un nouveau créneau horaire.',
    currentBooking: 'Réservation actuelle',
    selectNewTime: 'Sélectionnez un nouveau créneau horaire',
    bookingCanceled: 'Réservation annulée avec succès',
    alreadyBooked: 'Vous avez déjà une réservation pour cette sortie',
    noSpotsAvailable: 'Plus de places disponibles pour cette sortie',
    bookingFailed: 'Échec de la création de la réservation. Veuillez réessayer plus tard.',
    invalidSchedule: 'Sortie sélectionnée invalide'
  },
  profile: {
    editProfile: 'Modifier le profil',
    fullName: 'Nom complet',
    emailAddress: 'Adresse e-mail',
    details: 'Détails du membre',
    changePassword: 'Changer le mot de passe (Optionnel)',
    keepCurrentPassword: 'Laissez vide pour garder votre mot de passe actuel',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    updateProfile: 'Mettre à jour le profil',
    profileUpdated: 'Profil mis à jour avec succès',
    updateFailed: 'Échec de la mise à jour du profil',
    unexpectedError: 'Une erreur inattendue est survenue',
    validation: {
      nameRequired: 'Le nom est requis',
      emailRequired: "L'adresse e-mail est requise",
      invalidEmail: "Format d'adresse e-mail invalide",
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas'
    }
  },
  home: {
    hero: {
      title1: 'Vivez les Meilleures',
      title2: 'Aventures de Plongée',
      description:
        "Découvrez le monde sous-marin avec notre flotte de bateaux de plongée professionnels. Réservez votre prochaine expédition de plongée dès aujourd'hui."
    },
    features: {
      title: 'Pourquoi Nous Choisir',
      subtitle: 'Tout ce dont vous avez besoin pour une plongée parfaite',
      description:
        "Nous offrons des expériences de plongée de première qualité avec un équipement professionnel et des membres d'équipage expérimentés.",
      items: {
        equipment: {
          title: 'Équipement Professionnel',
          description:
            'Tous nos bateaux sont équipés du matériel de sécurité et de plongée le plus récent.'
        },
        crew: {
          title: 'Équipage Expérimenté',
          description:
            "Nos membres d'équipage sont des professionnels certifiés avec des années d'expérience."
        },
        scheduling: {
          title: 'Horaires Flexibles',
          description:
            "Choisissez parmi différents créneaux horaires qui s'adaptent parfaitement à votre emploi du temps."
        }
      }
    },
    cta: {
      title1: 'Prêt pour votre prochaine plongée ?',
      title2: "Commencez à réserver dès aujourd'hui.",
      description:
        'Rejoignez-nous pour une expérience de plongée inoubliable dans les plus beaux endroits.'
    }
  },
  auth: {
    signIn: {
      title: 'Connexion à votre compte',
      emailLabel: 'Adresse e-mail',
      passwordLabel: 'Mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPasswordLink: 'Mot de passe oublié ?',
      submitButton: 'Se connecter',
      noAccount: 'Pas encore de compte ?',
      signUpLink: "S'inscrire",
      welcomeBack: 'Bon retour !',
      welcomeText:
        'Connectez-vous pour accéder à vos sorties en bateau de plongée, suivre vos progrès et continuer votre voyage sous-marin avec YubiDive.',
      genericError: 'Une erreur est survenue lors de la connexion',
      emailRequired: "L'adresse e-mail est requise",
      invalidEmail: "Format d'adresse e-mail invalide",
      passwordRequired: 'Le mot de passe est requis'
    },
    signUp: {},
    signOut: {
      title: 'Déconnexion',
      message: 'Vous avez été déconnecté avec succès',
      redirectMessage: "Redirection vers la page d'accueil...",
      signInAgain: 'Se reconnecter'
    },
    forgotPassword: {
      title: 'Réinitialisation du mot de passe',
      description:
        'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
      emailLabel: 'Adresse e-mail',
      sendButton: 'Envoyer le lien de réinitialisation',
      backToSignIn: 'Retour à la connexion',
      success:
        'Si un compte existe avec cette adresse e-mail, vous recevrez un lien de réinitialisation.',
      errors: {
        emailRequired: "L'adresse e-mail est requise",
        invalidEmail: "Format d'adresse e-mail invalide",
        userNotFound: 'Aucun compte trouvé avec cette adresse e-mail',
        tooManyRequests: 'Trop de tentatives. Veuillez réessayer plus tard.'
      }
    }
  },
  dashboard: {
    title: 'Tableau de bord',
    welcome: 'Bienvenue, {name}',
    boats: 'Bateaux',
    bookings: 'Réservations',
    users: 'Utilisateurs',
    newUsers: 'Nouveaux utilisateurs',
    total: 'Total',
    active: 'Actifs',
    upcoming: 'À venir',
    lastMonth: 'Dernier mois',
    growth: 'Croissance',
    statistics: 'Statistiques',
    bookingsOverTime: 'Réservations dans le temps',
    bookingsByWeek: 'Réservations par semaine',
    usersByRole: 'Utilisateurs par rôle',
    bookingsByBoat: 'Réservations par bateau',
    upcomingBookings: 'Réservations à venir',
    availableDives: 'Sorties disponibles',
    noUpcomingBookings: 'Aucune réservation à venir',
    noAvailableDives: 'Aucune sortie disponible pour le moment',
    viewAllBookings: 'Voir toutes les réservations',
    viewAllSchedules: 'Voir tous les horaires',
    bookNow: 'Réserver',
    spots: 'places',
    upcomingSchedules: 'Prochaines sorties',
    boat: 'Bateau',
    dateTime: 'Date et heure',
    totalUsers: 'Total des utilisateurs',
    newUsersLastMonth: 'Nouveaux utilisateurs (30j)',
    activeUsers: 'Utilisateurs actifs',
    bookingsPerUser: 'Réservations par utilisateur',
    noUpcomingSchedules: 'Aucune sortie à venir'
  },
  users: {
    title: 'Utilisateurs',
    manageUsers: 'Gérer les utilisateurs',
    editUser: "Modifier l'utilisateur",
    createUser: 'Créer un utilisateur',
    name: 'Nom',
    email: 'Email',
    role: 'Rôle',
    password: 'Mot de passe',
    activeBookings: 'Réservations actives',
    roles: {
      member: 'Membre',
      admin: 'Administrateur'
    },
    actions: {
      save: 'Enregistrer les modifications',
      cancel: 'Annuler',
      create: 'Créer'
    },
    messages: {
      updateSuccess: 'Utilisateur mis à jour avec succès',
      updateError: "Échec de la mise à jour de l'utilisateur"
    }
  }
};

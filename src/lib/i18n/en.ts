export default {
  common: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    home: 'Home',
    boats: 'Boats',
    schedules: 'Schedules',
    bookings: 'Bookings',
    myBookings: 'My Bookings',
    upcomingBookings: 'Upcoming Bookings',
    pastBookings: 'Past Bookings',
    language: 'Language',
    english: 'English',
    french: 'Français',
    allBookings: 'All Bookings',
    bookNewDive: 'Book a Dive',
    viewBoats: 'View Boats',
    bookNow: 'Book Now',
    confirmBooking: 'Confirm Booking',
    cancel: 'Cancel',
    save: 'Save',
    of: 'of',
    viewAvailableBoats: 'View Available Boats',
    openUserMenu: 'Open user menu',
    openMainMenu: 'Open main menu',
    welcome: 'Welcome, {name}',
    profile: 'Your Profile',
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December'
    },
    weekDays: {
      sunday: 'Sun',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat'
    }
  },
  boats: {
    title: 'Boats',
    createBoat: 'Create Boat',
    name: 'Name',
    description: 'Description',
    capacity: 'Capacity',
    imageUrl: 'Image URL',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
    divers: 'divers',
    schedule: 'schedule',
    schedules: 'schedules',
    bookedDates: 'Booked dates',
    create: 'Create',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this boat?',
    yes: 'Yes',
    no: 'No',
    manageBoats: 'Manage Boats',
    addNewBoat: 'Add a Boat',
    editBoat: 'Edit Boat',
    deleteBoat: 'Delete Boat',
    noDescription: 'No description available',
    availableBoats: 'Available Boats',
    spotsLeft: 'spots left',
    boatDetails: 'Boat Details',
    boatName: 'Boat Name',
    confirmDelete: 'Confirm Delete',
    deleteConfirmation: 'Are you sure you want to delete this boat?',
    noBoatsAvailable: 'No boats available',
    checkBackLater: 'Check back later to see available boats and schedules.',
    boatList: 'Boat List',
    actions: 'Actions',
    noBookings: 'No bookings',
    noBoats: 'No boats',
    addFirstBoat: 'Add your first boat to get started.',
    upcomingSchedules: 'Upcoming Schedules',
    noUpcomingSchedules: 'No upcoming schedules',
    fullyBooked: 'Fully Booked'
  },
  schedules: {
    title: 'Schedules',
    date: 'Date',
    time: 'Time',
    startTime: 'Start Time',
    endTime: 'End Time',
    availableSpots: 'Available Spots',
    bookingFor: 'Booking For',
    upcomingSchedules: 'Upcoming Schedules',
    createSchedule: 'Create Schedule',
    editSchedule: 'Edit Schedule',
    deleteSchedule: 'Delete Schedule',
    noSchedules: 'No schedules available',
    addFirstSchedule: 'Add your first schedule',
    boatSchedules: 'Boat Schedules',
    addSchedule: 'Add Schedule',
    boat: 'Boat',
    dateTime: 'Date & Time',
    startDateTime: 'Start Date & Time',
    endDateTime: 'End Date & Time',
    bookings: 'Bookings',
    actions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    deleteConfirmation: 'Are you sure you want to delete the schedule for {boat} on {date}?'
  },
  bookings: {
    noUpcomingBookings: 'No upcoming bookings',
    upcomingBookingsWillAppear: 'Upcoming bookings will appear here',
    noPastBookings: 'No past bookings',
    pastBookingsWillAppear: 'Past bookings will appear here',
    noBookingsYet: 'No bookings yet',
    bookingsWillAppear: 'Bookings will appear here once members start making reservations',
    startBooking: 'Start by booking a dive from our available schedules',
    bookedBy: 'Booked by',
    cancelBooking: 'Cancel Booking',
    cancelConfirmation:
      'Are you sure you want to cancel the booking for {boat} on {date}? This action cannot be undone.',
    upcoming: 'Upcoming',
    past: 'Past',
    status: {
      upcoming: 'Upcoming',
      past: 'Past'
    },
    alreadyBooked: 'You already have a booking for this schedule',
    noSpotsAvailable: 'No spots available for this schedule',
    bookingFailed: 'Failed to create booking. Please try again later.',
    invalidSchedule: 'Invalid schedule selected'
  },
  home: {
    hero: {
      title1: 'Experience the Best',
      title2: 'Scuba Diving Adventures',
      description:
        'Discover the underwater world with our fleet of professional diving boats. Book your next diving expedition today.'
    },
    features: {
      title: 'Why Choose Us',
      subtitle: 'Everything you need for the perfect dive',
      description:
        'We provide top-notch diving experiences with professional equipment and experienced crew members.',
      items: {
        equipment: {
          title: 'Professional Equipment',
          description: 'All our boats are equipped with the latest safety and diving equipment.'
        },
        crew: {
          title: 'Experienced Crew',
          description: 'Our crew members are certified professionals with years of experience.'
        },
        scheduling: {
          title: 'Flexible Scheduling',
          description: 'Choose from various time slots that fit your schedule perfectly.'
        }
      }
    },
    cta: {
      title1: 'Ready for your next adventure?',
      title2: 'Start booking today.',
      description: 'Join us for an unforgettable diving experience in the most beautiful locations.'
    }
  },
  profile: {
    editProfile: 'Edit Profile',
    fullName: 'Full name',
    emailAddress: 'Email address',
    details: 'Member Details',
    changePassword: 'Change Password (Optional)',
    keepCurrentPassword: 'Leave blank to keep your current password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    updateProfile: 'Update Profile',
    profileUpdated: 'Profile updated successfully',
    updateFailed: 'Failed to update profile',
    unexpectedError: 'An unexpected error occurred',
    validation: {
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      invalidEmail: 'Invalid email format',
      passwordsDoNotMatch: 'Passwords do not match'
    }
  },
  schedule: {
    date: 'Date',
    time: 'Time',
    boat: 'Boat',
    availableSpots: 'Available Spots',
    details: 'Schedule Details'
  },
  auth: {
    signIn: {
      title: 'Sign in to your account',
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      signInButton: 'Sign in',
      noAccount: "Don't have an account?",
      createAccount: 'Create an account',
      errors: {
        invalidCredentials: 'Invalid email or password',
        emailRequired: 'Email address is required',
        invalidEmail: 'Invalid email format',
        passwordRequired: 'Password is required'
      }
    },
    signOut: {
      title: 'Sign out',
      message: 'You have been successfully signed out',
      redirectMessage: 'Redirecting to home page...',
      signInAgain: 'Sign in again'
    },
    forgotPassword: {
      title: 'Reset your password',
      description: "Enter your email address and we'll send you a link to reset your password.",
      emailLabel: 'Email address',
      sendButton: 'Send reset link',
      backToSignIn: 'Back to sign in',
      success:
        'If an account exists with this email address, you will receive a reset link shortly.',
      errors: {
        emailRequired: 'Email address is required',
        invalidEmail: 'Invalid email format',
        userNotFound: 'No account found with this email address',
        tooManyRequests: 'Too many attempts. Please try again later.'
      }
    }
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome, {name}',
    upcomingBookings: 'Upcoming Bookings',
    availableDives: 'Available Dives',
    noUpcomingBookings: 'No upcoming bookings',
    noAvailableDives: 'No available dives at the moment',
    viewAllBookings: 'View All Bookings',
    viewAllSchedules: 'View All Schedules',
    bookNow: 'Book Now',
    spots: 'spots',
    statistics: 'Statistics',
    totalBookings: 'Total Bookings',
    totalRevenue: 'Total Revenue',
    activeUsers: 'Active Users',
    lastBookings: 'Last Bookings',
    boat: 'Boat',
    dateTime: 'Date & Time',
    bookings: 'Bookings',
    overview: 'Overview',
    cards: {}
  }
};

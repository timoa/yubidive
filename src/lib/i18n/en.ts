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
    bookNewDive: 'Book New Dive',
    viewBoats: 'View Boats',
    bookNow: 'Book Now',
    viewAvailableBoats: 'View Available Boats',
    openUserMenu: 'Open user menu',
    openMainMenu: 'Open main menu',
    welcome: 'Welcome, {name}',
    profile: 'Your Profile'
  },
  boats: {
    manageBoats: 'Manage Boats',
    addNewBoat: 'Add New Boat',
    editBoat: 'Edit Boat',
    deleteBoat: 'Delete Boat',
    noDescription: 'No description available',
    divers: 'divers',
    schedule: 'schedule',
    schedules: 'schedules',
    availableBoats: 'Available Boats',
    capacity: 'Capacity',
    spotsLeft: 'spots left',
    boatDetails: 'Boat Details',
    boatName: 'Boat Name',
    description: 'Description',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Confirm Delete',
    deleteConfirmation: 'Are you sure you want to delete this boat?',
    noBoatsAvailable: 'No boats available',
    checkBackLater: 'Check back later to see available boats and schedules.',
    boatList: 'Boat List',
    actions: 'Actions',
    imageUrl: 'Image URL',
    noBookings: 'No bookings',
    bookedDates: 'Booked Dates',
    noBoats: 'No boats',
    addFirstBoat: 'Add your first boat to get started.',
    upcomingSchedules: 'Upcoming Schedules',
    noUpcomingSchedules: 'No upcoming schedules',
    fullyBooked: 'Fully Booked'
  },
  schedules: {
    boatSchedules: 'Boat Schedules',
    createNewSchedule: 'Create New Schedule',
    selectBoat: 'Select Boat',
    selectABoat: 'Select a boat...',
    date: 'Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    upcomingSchedules: 'Upcoming Schedules',
    createSchedule: 'Create Schedule',
    boat: 'Boat',
    time: 'Time',
    bookings: 'Bookings',
    actions: 'Actions',
    deleteSchedule: 'Delete Schedule',
    deleteConfirmation:
      'Are you sure you want to delete the schedule for {boat} on {date}? This action cannot be undone.',
    save: 'Save',
    cancel: 'Cancel',
    editSchedule: 'Edit schedule'
  },
  bookings: {
    noUpcomingBookings: 'No upcoming bookings',
    upcomingBookingsWillAppear: 'Upcoming bookings will appear here',
    noPastBookings: 'No past bookings',
    pastBookingsWillAppear: 'Past bookings will appear here',
    noBookingsYet: 'No bookings yet',
    bookingsWillAppear: 'Bookings will appear here once customers start making reservations',
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
    }
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
  }
};

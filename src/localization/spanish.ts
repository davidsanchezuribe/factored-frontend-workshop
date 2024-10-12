import { AppMessages } from './LocalizationTypes';

const spanish: AppMessages = {
  corporativeDirectory: {
    retrievingData: 'Obteniendo datos de los empleados',
    showSkills: 'Habilidades de {0}',
    closeDialog: 'Cerrar',
    headers: {
      avatar: 'Avatar',
      name: 'Nombre',
      position: 'Cargo',
      skills: 'Habilidades',
    },
  },
  navBar: {
    account: 'Mi Cuenta',
    signIn: 'Ingresar',
    signUp: 'Registrarse',
    logout: 'Cerrar Sesión',
    greeting: 'Hola',
    manageAccount: 'Administrar Cuenta',
    errors: {
      'auth/server-error': 'Error en el servidor',
    },
  },
  strengthBar: {
    level1: 'debil',
    level2: 'algo debil',
    level3: 'fuerte',
    level4: 'muy fuerte',
    tooShort: 'muy corta',
  },
  login: {
    form: {
      title: 'Iniciar Sesión',
      altTitle: 'Iniciar Sesión vía Link',
      reset: 'Limpiar',
      login: 'Ingresar',
      or: 'o',
      forgotPassword: '¿Olvidaste la contraseña? Reestablécela aquí',
      notRegistered: '¿Aún no tienes cuenta? Da clic aquí para crearla',
    },
    email: {
      label: 'correo electrónico',
      valid: 'por favor ingrese un email válido',
      required: 'el campo "email" es obligatorio',
    },
    password: {
      label: 'contraseña',
      required: 'el campo "contraseña" es obligatorio',
    },
    emailLink: {
      label: 'Link de ingreso',
      tooltip: 'Ingresa mediante un link enviado a su correo',
    },
    remember: {
      label: 'Recuérdame',
      tooltip: 'menos inicios de sesión',
      noStorage: 'las cookies deben estar habilitadas para usar esta opción',
    },
    sentMail: 'El correo ha sido enviado exitosamente a',
    sentLink: 'Link enviado',
    tryAgain: 'intente de nuevo en',
    errors: {
      'auth/web-storage-unsupported': 'Para poder ingresar, se deben habilitar las cookies',
      'auth/user-not-found': 'Este usuario no ha sido encontrado',
      'auth/wrong-password': 'El usuario o la contraseña son incorrectos',
      'auth/server-error': 'Error en el servidor',
      'auth/too-many-requests': 'Demasiados intentos fallidos para ingresar',
      'auth/quota-exceeded': 'Se han hecho varias solicitudes de link desde esta dirección, utilice otro método de ingreso o ingrese más tarde',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/multi-factor-auth-required': 'Para continuar es necesario autenticarse con otro método',
      'auth/invalid-credential': 'Correo electrónico o contraseña incorrectos',
    },
    userNotFoundDialog: {
      title: 'Usuario no Encontrado',
      description: 'Parece que la cuenta que intentas acceder no existe. ¿Deseas registrarte?',
      positiveLabel: 'Si',
      negativeLabel: 'No',
    },
  },
  mfaLogin: {
    title: 'Autenticación en dos pasos',
    phone: {
      description: {
        prefix: 'Enviar un código SMS al teléfono',
        suffix: 'para autenticarse',
      },
      notSolvedCaptcha: 'Da clic en "No soy un Robot"',
      sendSMS: 'Enviar código',
      wait: 'Código enviado, intente de nuevo en',
      sendedSMS: 'El código SMS ha sido enviado a su teléfono, si no llega intente de nuevo en un minuto',
      errors: {
        'auth/invalid-verification-id': 'Identificación de verificación no válida',
        'auth/invalid-verification-code': 'El código ingresado ha expirado o es incorrecto',
        'auth/undefined-verifier': '¿Eres un robot?',
        'auth/network-request-failed': 'Parece que no hay conexión a internet',
        'auth/server-error': 'Error en el servidor',
      },
    },
    totp: {
      enterCode: 'Para continuar, ingrese el código de una de las siguientes aplicaciones dónde inscribió esta cuenta',
      errors: {
        'auth/invalid-verification-code': 'El código ingresado ha expirado o es incorrecto',
        'auth/network-request-failed': 'Parece que no hay conexión a internet',
        'auth/server-error': 'Error en el servidor',
      },
    },
  },
  passwordReset: {
    form: {
      title: 'Cambiar contraseña',
      clean: 'Limpiar',
      reset: 'Cambiar contraseña',
      backToLogin: 'Regresar a la ventana de ingreso?',
      socialNetworks: '¿Ingresar con redes sociales?',
      clickHere: 'Da clic aquí',
      notRegistered: '¿Aún no tienes cuenta? Da clic aquí para crearla',
    },
    email: {
      label: 'correo electrónico',
      valid: 'por favor ingrese un email válido',
      required: 'el campo "email" es obligatorio',
    },
    sentMailDialog: {
      description: 'Si existe un usuario con ese correo, se ha enviado un link para restablecer la contraseña a',
      okLabel: 'Continuar',
      cancelLabel: 'Reintentar',
    },
    errors: {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
    userNotFoundDialog: {
      title: 'Usuario no Encontrado',
      description: 'Parece que la cuenta que intentas recuperar no existe. ¿Deseas registrarte?',
      positiveLabel: 'Si',
      negativeLabel: 'No',
    },
  },
  signUp: {
    form: {
      title: 'Registro',
      reset: 'Limpiar',
      signUp: 'Registrarse',
      alreadyRegistered: '¿Ya tienes cuenta?',
      socialNetworks: '¿Ingresar con redes sociales?',
      clickHere: 'Da clic aquí',
      unsolvedCaptcha: 'Da clic a "No soy un robot"',
    },
    email: {
      label: 'correo electrónico',
      valid: 'por favor ingrese un email válido',
      required: 'el campo "email" es obligatorio',
    },
    confirmEmail: {
      label: 'confirmar correo electrónico',
      valid: 'por favor ingrese un email válido',
      required: 'se debe confirmar el correo electrónico',
      matchError: 'los correos electrónicos deben coincidir',
      matchSuccess: 'los correos electrónicos coinciden',
    },
    password: {
      label: 'contraseña',
      max: 'la contraseña debe tener máximo 64 caracteres',
      min: 'la contraseña debe tener mínimo 8 caracteres',
      required: 'el campo "contraseña" es obligatorio',
    },
    remember: {
      label: 'Recuérdame',
      tooltip: 'menos inicios de sesión',
      noStorage: 'las cookies deben estar habilitadas para usar esta opción',
    },
    errors: {
      'auth/web-storage-unsupported': 'Esta cuenta ha sido creada probablemente. Si desea ingresar, se deben habilitar las cookies',
      'auth/email-already-in-use': 'Este correo electrónico ya ha sido utilizado',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
    existentAccountDialog: {
      title: 'Cuenta existente',
      description: 'Parece que la cuenta que intentas crear ya existe. ¿Deseas mejor iniciar sesion?',
      positiveLabel: 'Si',
      negativeLabel: 'No',
    },
    cookiesErrorDialog: {
      title: 'Las cookies están bloqueadas',
      description: 'Esta cuenta ha sido creada probablemente. Si desea ingresar, se deben habilitar las cookies',
      positiveLabel: 'Continuar',
    },
  },
  emailSign: {
    email: {
      label: 'correo electrónico',
      valid: 'por favor ingrese un email válido',
      required: 'el campo "email" es obligatorio',
    },
    errors: {
      'auth/web-storage-unsupported': 'Para poder ingresar, se deben habilitar las cookies',
      'auth/invalid-action-code': 'Este link ha vencido o ya ha sido utilizado',
      'auth/expired-action-code': 'Este link ha vencido',
      'auth/invalid-email': 'Este correo electrónico no coincide con el que se envió el enlace',
      'auth/multi-factor-auth-required': 'Para continuar es necesario autenticarse con otro método',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
    setPassword: {
      title: 'Establecer o cambiar la contraseña',
      firstDescription: 'Al ingresar por primera vez mediante un link de correo electrónico, se deshabilita la contraseña establecida. Si desea, puede establecerla ingresándola nuevamente o eligiendo una nueva contraseña en el siguiente formulario.',
      secondDescription: 'Puede saltar este paso y establecer luego la contraseña en la ventana de ingreso haciendo clic en "Olvidaste la contraseña", o en la ventana de "Administrar Cuenta" al ingresar a la aplicación mediante un nuevo link de correo electrónico.',
    },
    verificatedPrefix: 'Se ha verificado con éxito el correo ',
    verificatedSuffix: '',
    mfaVerificated: 'Correo verificado, ya puede continuar configurando la autenticación en dos pasos',
    enrollReauthenticated: 'Usuario reautenticado, ya puede continuar configurando la autenticación en dos pasos',
    unenrollReauthenticated: 'Usuario reautenticado, ya puede continuar deshabilitando la autenticación en dos pasos',
    setpasswordReauthenticated: 'Usuario reautenticado, ya puede continuar estableciendo o cambiando la contraseña',
    deleteReauthenticated: 'Usuario reautenticado, ya puede continuar eliminando la cuenta',
  },
  manageAccount: {
    title: 'Administrar Cuenta',
    accountVerification: 'Verificación de cuenta',
    setPassword: 'Establecer o cambiar la contraseña',
    changePassword: 'Cambiar la contraseña',
    preferences: 'Preferencias',
    cookiesStorage: 'Almacenamiento de cookies',
    twoFactorAuthentication: 'Autenticación en dos pasos',
    deleteAccount: 'Eliminar la cuenta',
  },
  accountVerification: {
    verifiedEmail: 'Correo electrónico verificado',
    notVerifiedEmailTitle: 'Correo electrónico no verificado',
    notVerifiedEmailDefaultMessage: 'Para verificar este correo electrónico debe ingresar mediante un link.',
    notVerifiedEmailMFAMessage: 'Para activar la autenticación en dos pasos, se debe verificar primero el correo electrónico ingresando mediante un link',
    sendLink: 'Enviar link de verificación',
    sentMail: 'El correo con el link de verificación ha sido enviado exitosamente a',
    remember: {
      label: 'Recuérdame',
      tooltip: 'menos inicios de sesión',
      noStorage: 'las cookies deben estar habilitadas para usar esta opción',
    },
    errors: {
      'auth/server-error': 'Error en el servidor',
      'auth/quota-exceeded': 'Se han hecho varias solicitudes de link desde esta dirección, utilice otro método de ingreso o ingrese más tarde',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
    },
  },
  twoFactorAuthentication: {
    enrollReauthenticated: 'Usuario reautenticado, ya puede continuar configurando la autenticación en dos pasos',
  },
  mfaSwitch: {
    viaPhone: 'vía teléfono',
    viaTOTP: 'vía totp app',
  },
  mfaPhoneInputCode: {
    label: 'Código SMS',
    codeConfirm: 'Confirmar código SMS',
    onlyNumbers: 'Debe ingresar solo números',
    numChar: 'El código debe contener máximo 6 números',
  },
  mfaTOTPInputCode: {
    label: 'Código totp',
    codeConfirm: 'Confirmar código totp',
    onlyNumbers: 'Debe ingresar solo números',
    numChar: 'El código totp debe contener máximo 6 números',
  },
  mfaPhoneEnroll: {
    description: 'Para activar la autenticación en dos pasos, es necesario ingresar un código que será enviado a su celular',
    enrolled: 'Teléfono inscrito con éxito para ingresar como segundo factor de autenticación',
    phone: {
      label: 'Teléfono',
      notValid: 'Ingrese un número de teléfono válido',
      notSolvedCaptcha: 'Da clic en "No soy un Robot"',
      sendSMS: 'Enviar código',
      wait: 'Código enviado, intente de nuevo en',
      sendedSMS: 'El código SMS ha sido enviado a su teléfono, si no llega intente de nuevo en un minuto',
    },
    errors: {
      'auth/invalid-verification-id': 'Identificación de verificación no válida',
      'auth/invalid-verification-code': 'El código ingresado ha expirado o es incorrecto',
      'auth/undefined-verifier': '¿Eres un robot?',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/unverified-email': 'El email no ha sido verificado',
      'auth/requires-recent-login': 'Para activar la autenticación en dos pasos, se debe haber ingresado a la aplicación recientemente',
      'auth/user-token-expired': 'Para activar la autenticación en dos pasos, se debe haber ingresado a la aplicación recientemente',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
  },
  mfaUnenroll: {
    phoneDescription: 'La autenticación en dos pasos ya está activada con el número de teléfono',
    totpDescription: 'La autenticación en dos pasos ya está activada con un código generado por una de las siguientes aplicaciones',
    disablePhoneMFA: 'Deshabilitar autenticación en dos pasos via teléfono',
    disableTotpMFA: 'Deshabilitar autenticación en dos pasos via aplicación totp',
    unenrolledPhoneMFA: 'La autenticación en dos factores vía teléfono se ha deshabilitado correctamente',
    unenrolledTotpMFA: 'La autenticación en dos factores vía aplicación totp se ha deshabilitado correctamente',
    errors: {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/requires-recent-login': 'Para desactivar la autenticación en dos pasos, se debe haber ingresado a la aplicación recientemente',
      'auth/user-token-expired': 'Para desactivar la autenticación en dos pasos, se debe haber ingresado a la aplicación recientemente',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
  },
  mfaTotpEnroll: {
    generateQR: 'Generar código QR',
    secretKey: 'Clave secreta',
    clipboard: 'Copiar al portapapeles',
    secretKeyCopied: 'La clave secreta se ha copiado al portapapeles',
    downloadApp: '1. Descargar una de las siguientes aplicaciones de autenticación:',
    scanCode: '2. Escanear el código QR o ingresar la clave secreta en la aplicación de autenticación descargada.',
    enterCode: '3. Ingresar el código generado por la aplicación:',
    enrolled: 'Token inscrito con éxito para ingresar como segundo factor de autenticación',
    showSecretKey: 'Mostrar clave secreta',
    hideSecretKey: 'Esconder clave secreta',
    errors: {
      'auth/invalid-verification-code': 'El código ingresado ha expirado o es incorrecto',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
  },
  totpApps: {
    authy: 'Authy',
    ma: 'Microsoft Authenticator',
    ga: 'Google Authenticator',
  },
  reauthentication: {
    title: 'Confirmar identidad',
    description: 'Para realizar esta operación es necesario confirmar su identidad usando cualquiera de los siguientes métodos de ingreso',
    form: {
      reset: 'Limpiar',
      confirm: 'Confirmar',
      sendLink: 'Enviar Link',
      or: 'o',
      // facebookAlt: 'Sigue con Facebook',
      // twitterAlt: 'Sigue con Twitter',
      // forgotPassword: '¿Olvidaste la contraseña? Reestablécela aquí',
      // notRegistered: '¿Aún no tienes cuenta? Da clic aquí para crearla',
    },
    email: {
      label: 'correo electrónico',
    },
    password: {
      label: 'contraseña',
      required: 'el campo "contraseña" es obligatorio',
    },
    emailLink: {
      label: 'Link de ingreso',
      tooltip: 'Ingresa mediante un link enviado a su correo',
    },
    sentMail: 'El correo ha sido enviado exitosamente a',
    sentLink: 'Link enviado',
    tryAgain: 'intente de nuevo en',
    errors: {
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/web-storage-unsupported': 'Para poder ingresar, se deben habilitar las cookies',
      'auth/server-error': 'Error en el servidor',
      'auth/quota-exceeded': 'Se han hecho varias solicitudes de link desde esta dirección, utilice otro método de ingreso o ingrese más tarde',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/multi-factor-auth-required': 'Para continuar es necesario autenticarse con otro método',
      'auth/invalid-credential': 'Contraseña incorrecta',
    },
  },
  socialProviders: {
    providerSignInErrors: {
      'auth/multi-factor-auth-required': 'Para continuar es necesario autenticarse con otro método',
      'auth/account-exists-with-different-credential': 'Este correo ya se usa para ingresar de otra u otras formas. Para ingresar con este proveedor, primero ingrese de otra manera y luego vincule este proveedor desde las opciones de usuario',
      'auth/web-storage-unsupported': 'Parece que las cookies están desabilitadas para esta página',
      'auth/popup-blocked': 'Las ventanas emergentes están bloqueadas para esta página',
      'auth/cancelled-popup-request': 'Ya había una ventana de inicio de sesión abierta con el proveedor, solo la última dará acceso',
      'auth/popup-closed-by-user': 'Se ha cerrado la ventana para iniciar sesión con el proveedor',
      'auth/server-error': 'Error en el servidor',
      'auth/user-not-signed': 'El usuario no ha iniciado sesión',
      'auth/internal-error': 'Parece que no hay conexión a internet',

    },
    existingSignInMethods: {
      prefix: 'Este correo ya se usa para ingresar mediante',
      and: 'y',
      suffix: 'Para ingresar de esta forma, primero ingrese con alguno de los proveedores mencionados y luego vincule este proveedor desde las opciones de usuario.',
      password: 'correo electrónico y contraseña',
      emailLink: 'link via correo electrónico',
    },
    facebookAlt: 'Sigue con Facebook',
    twitterAlt: 'Sigue con Twitter',
  },
  setPassword: {
    form: {
      reset: 'Limpiar',
      setPassword: 'Establecer contraseña',
      successSet: 'Contraseña establecida con éxito',
    },
    password: {
      label: 'contraseña',
      max: 'la contraseña debe tener máximo 64 caracteres',
      min: 'la contraseña debe tener mínimo 8 caracteres',
      required: 'el campo "contraseña" es obligatorio',
    },
    confirmPassword: {
      label: 'confirmar la contraseña',
      required: 'se debe confirmar la contraseña',
      matchError: 'las contraseñas deben coincidir',
      matchSuccess: 'las contraseñas coinciden',
    },
    errors: {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/requires-recent-login': 'Para establecer una contraseña se debe haber ingresado a la aplicación recientemente',
      'auth/user-token-expired': 'Para establecer una contraseña se debe haber ingresado a la aplicación recientemente',
      'auth/server-error': 'Error en el servidor',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
    },
  },
  preferences: {
    displayName: {
      label: 'Nombre para mostrar',
      required: 'El campo "nombre para mostrar" no debe estar vacío',
      profane: 'Nombre de usuario no permitido',
      max: 'El nombre para mostrar está demasiado largo',
    },
    avatar: {
      profilePicture: 'Imagen de perfil',
      uploadPicture: 'Subir imagen',
      clearPicture: 'Borrar imagen',
      notTouched: 'La foto no ha sido editada',
    },
    reset: 'Reestablecer',
    updatePreferences: 'Actualizar preferencias',
    sameValuesTooltip: 'Para actualizar debe modificar alguno de los campos',
    errors: {
      'auth/user-not-found': 'Usuario no encontrado',
      'storage/server-error': 'Error en el servicio de almacenamiento',
      'auth/server-error': 'Error en el servidor',
      'storage/unauthorized': 'Servicio de almacenamiento no disponible',
      'storage/retry-limit-exceeded': 'Parece que no hay conexión a internet',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'profanity-filter/nsfw-image': 'La foto de usuario podría incluir contenido inapropiado',
      'profanity-filter/nsfw-name': 'El nombre de usuario podría incluir contenido inapropiado',
    },
    preferencesUpdated: 'Las preferencias han sido actualizadas correctamente',
  },
  cookiesStorage: {
    enable: 'habilitar',
    disable: 'deshabilitar',
    description: 'Si habilita las cookies podrá mejorar la experiencia de uso, guardando automáticamente preferencias como: idioma, mantener la sesión iniciada, entre otras.',
    eraseCookies: 'Borrar cookies',
    showCookies: 'Mostrar cookies',
    hideCookies: 'Ocultar cookies',
    reset: 'Reestablecer',
    update: 'Actualizar',
    noChangesTooltip: 'No se ha hecho ningún cambio',
    noCookiesStoraged: 'No hay cookies almacenadas',
    cookiesEnabled: 'Las cookies han sido habilitadas',
    cookiesDisabled: 'Las cookies han sido deshabilitadas',
  },
  eraseAccount: {
    warning: 'Aquí puedes eliminar tu cuenta permanentemente. Todos los datos asociados a esta cuenta seran eliminados también y será imposible recuperarlos en un futuro.',
    deleteData: 'Entiendo que al eliminar mi cuenta todos los datos asociados a esta serán eliminados permanentemente',
    deleteAccount: 'Quiero eliminar mi cuenta',
    delete: 'Eliminar cuenta',
    notSelected: 'Para continuar seleccione ambas casillas',
    deleteReauthenticated: 'Usuario reautenticado, ya puede continuar eliminando la cuenta',
    errors: {
      'storage/unauthorized': 'Servicio de almacenamiento no disponible',
      'storage/server-error': 'Error en el servicio de almacenamiento',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/requires-recent-login': 'Para eliminar la cuenta, se debe haber ingresado a la aplicación recientemente',
      'auth/user-token-expired': 'Para eliminar la cuenta, se debe haber ingresado a la aplicación recientemente',
      'auth/network-request-failed': 'Parece que no hay conexión a internet',
      'auth/server-error': 'Error en el servidor',
    },
  },
  withAuth: {
    signing: 'intentando iniciar sesión',
    noInternetConnection: {
      title: 'Sin conexión a internet',
      description: 'Parece que no hay conexión a internet. Revise primero la conexión y a continuación actualice la página.',
      primaryActionLabel: 'Intentar de nuevo',
      secondaryActionLabel: 'Regresar a la página inicial',
    },
  },
  cookieConsent: {
    title: 'Consentimiento del almacenamiento de Cookies',
    storage: {
      message: 'Esta aplicación usa cookies para mejorar la experiencia de uso, guardando automáticamente preferencias como: idioma, mantener la sesión iniciada, entre otras',
      agree: 'Acepto',
      disagree: 'No acepto',
    },
    notStorage: {
      message: 'Las cookies están deshabilitadas en este navegador, por lo cual no se podrá mejorar la experiencia de uso, guardando automáticamente preferencias como: idioma, mantener la sesión iniciada, entre otras',
      understand: 'Entiendo',
    },
  },
  pageNotFound: {
    title: 'Página no encontrada',
    description: 'La página que estás buscando no ha sido encontrada',
    primaryActionLabel: 'Regresar a la página inicial',
  },
};

export default spanish;

export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Navigation
    nav: {
      // home: 'Home', - removed
      about: 'INFO',
      // poems: 'Poems', - REMOVED
      portfolio: 'MEDIA',
      services: 'CREW',
      fantasma: 'FNTSM',
      experience: 'EXPERIENCE',
      contact: 'CONTACT',
    },
    // Hero Section
    hero: {
      title: 'RANDOM',
      subtitle: 'Random is born from the crossroads between the dreamlike, the political, art, cinema and technology. A space where the imagined and the lived merge, shaping stories and landscapes that invite exploration from other places and experiences.',
      description: '',
      viewPortfolio: 'Dreams',
      getInTouch: 'Nightmares',
      work: 'WORK',
      crew: 'CREW',
      downloads: 'DOWNLOADS',
      contact: 'CONTACT',
    },
    // Poems Section
    poems: {
      title: 'Digital Verses',
      description1: "In the realm of digital poetry, words transform into living entities that dance between reality and virtuality. Here, verses are born from the intersection of human emotion and algorithmic beauty.",
      description2: "Each poem emerges as a fragment of consciousness, captured through the lens of machinima and digital storytelling. The boundaries between author and algorithm blur in this creative space.",
      description3: "Poetry becomes a bridge between the tangible and the ethereal, where each word carries the weight of dreams and the lightness of digital whispers. These verses challenge traditional narrative structures.",
      poeticElements: 'Poetic Elements',
      types: {
        narrative: 'Narrative Poetry',
        lyrical: 'Lyrical Expression',
        emotional: 'Emotional Depth',
        experimental: 'Experimental Form',
      },
    },
    // About Section
    about: {
      title: 'About this project',
      description1: "During 2020, many of us never imagined living through a pandemic. We never thought we would have to spend months confined to our homes, in quarantine, to avoid getting infected. Going to the supermarket or walking the pet posed a risk of contracting the disease. Being exposed to this constant risk generated moods marked by anxiety, which in many cases manifested through dreams experienced with great intensity. These vivid dreams, with high emotional and visual content, appeared during the REM or rapid eye movement sleep stage.",
      description2: "The proposal we present deals with a co-authorial creation project using video-installation and videogame creation as the main medium of development and production. We are interested in exploring the intersection between video art, cinema, videogames and their relationship with dreams as producers of visual and poetic phenomena, while evoking various emotional states. From the analysis of dreams of 3 participants who have been invited to share them with us, together with the use of the GTA V videogame platform (MACHINIMA), we wanted to give life to those dreams generating moving images produced from the computer as rendered video (design of scenarios, characters and virtual sounds).",
      description3: "These expressive and surrealist images, of cinematographic character, reflect in their visual narrative the artifice, a simulacrum of non-linear narrative universes, alternative realities and apocalyptic and nostalgic discourses. In 2025, the experience expands with a unified and renewed 2.0 version that uses Unreal Engine, a graphics engine that allows creating an immersive 3D environment where geography, time and rules are reconfigured. This digital space invites exploring new ways of inhabiting the dreamlike, in an experience for visitors that mixes interactivity, gaming and audiovisual montage, enhancing the sensory and poetic journey offered by the installation.",
      coreStrengths: 'Core Strengths',
      skills: {
        creativeThinking: 'Creative Thinking',
        problemSolving: 'Problem Solving',
        userExperience: 'User Experience',
        innovation: 'Innovation',
      },
    },
    // Portfolio Section
    portfolio: {
      title: 'Media-Gallery',
      description: 'This space is for you to explore visually and directly. Here you will find selected images that show key moments of the project, along with the option to download the interactive video game experience. The gallery invites you to immerse yourself in the dreamlike universe we created, where art, dreams and technology meet to offer an interactive and sensory experience. It is an opportunity to live the work from within, playing, exploring and connecting with dreams that have been transformed into digital architectures and landscapes.',
      projects: {
        organicEcommerce: {
          title: 'Organic E-commerce',
          description: 'A sustainable shopping platform with fluid animations and natural design patterns.',
        },
        motionStudio: {
          title: 'Motion Studio',
          description: 'Creative agency website featuring advanced parallax effects and smooth transitions.',
        },
        forestDashboard: {
          title: 'Forest Dashboard',
          description: 'Environmental monitoring dashboard with organic data visualizations.',
        },
        naturePortfolio: {
          title: 'Nature Portfolio',
          description: 'Photography portfolio with immersive scroll experiences and fluid layouts.',
        },
      },
    },
    // Services Section
    services: {
      title: 'CREW',
    description: 'Here we present those who brought this project to life, from the creative voices to those who shared their dreams to transform them into artwork. Katherine Hoch and Eduardo Pino generously open their dreamlike experiences, inviting us to explore with their dreams the boundaries between the real and the imagined. Camila Estrella, theorist and participant, contributes from reflection and also shares one of the dreams that inspired the work. Sebastián Vidal, curator and theorist, accompanies guiding the general vision and dialogue between art and technology. Barbara Oettinger, visual artist and filmmaker, and Pepo Sabatini, filmmaker and 3D animator, jointly created the imagery and aesthetic conception of the project, fusing creative vision and technique. Barbara brings a sensitive and poetic perspective that permeates the proposal, while Pepo contributes his vision and expertise within the 3D universe. Each one, from their place, builds a collective framework that crosses art, technology and dreams.',
      webDevelopment: {
        title: 'Web Development',
        description: 'Custom websites and applications built with modern technologies and organic design principles.',
        features: ['React & Next.js', 'Node.js Backend', 'Database Integration', 'API Development'],
      },
      uiuxDesign: {
        title: 'UI/UX Design',
        description: 'Beautiful, intuitive interfaces that follow natural design patterns and enhance user experience.',
        features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      },
      mobileDevelopment: {
        title: 'Mobile Development',
        description: 'Responsive web applications and native mobile apps optimized for all devices.',
        features: ['Progressive Web Apps', 'React Native', 'Cross-platform', 'App Store Deployment'],
      },
      performanceOptimization: {
        title: 'Performance Optimization',
        description: 'Speed up your website and improve user experience with advanced optimization techniques.',
        features: ['Core Web Vitals', 'Code Splitting', 'Image Optimization', 'Caching Strategies'],
      },
      seoAnalytics: {
        title: 'SEO & Analytics',
        description: 'Improve your online visibility and track performance with comprehensive SEO and analytics.',
        features: ['Technical SEO', 'Google Analytics', 'Search Console', 'Performance Monitoring'],
      },
      consultation: {
        title: 'Consultation',
        description: 'Strategic guidance for your digital projects, from concept to successful implementation.',
        features: ['Project Planning', 'Tech Stack Selection', 'Architecture Design', 'Team Training'],
      },
      crew: {
        barbara: {
          name: 'BÁRBARA OETTINGER',
          role: 'Creator and Director',
          bio: 'Structural Creative Development, incorporating Visual Arts as central language.',
        },
        pepo: {
          name: 'PEPO SABATINI',
          role: 'Creator and Director',
          bio: 'From the world of cinema to video games and also vice versa.',
        },
        sebastian: {
          name: 'SEBASTIAN VIDAL',
          role: 'curator and theorist',
          bio: 'The assemblage of memory and remembrance, evoked by the trace and its search.',
        },
        katherine: {
          name: 'KATHERINE HOCH',
          role: 'Participant',
          bio: 'Shares her dreamlike experiences to explore the real and the imagined.',
        },
        eduardo: {
          name: 'EDUARDO PINO',
          role: 'Participant',
          bio: 'Opens his dreams to the dialogue between art, technology and memory.',
        },
        camila: {
          name: 'CAMILA ESTRELLA',
          role: 'Theorist and Participant',
          bio: 'Provides reflection and shares one of the dreams that inspired the work.',
        },
        chini: {
          name: 'CHINI',
          role: 'Participant',
          bio: 'Shares dreamlike experiences that nourish the work.',
        },
        yeikob: {
          name: 'YEIKOB',
          role: 'Participant',
          bio: 'Participates by sharing dreamlike experiences that inspire the work.',
        },
        nacho: {
          name: 'NACHO',
          role: 'Participant',
          bio: 'Shares dreamlike experiences that nourish the project\'s imagery.',
        },
        marco: {
          name: 'MARCO',
          role: 'Participant',
          bio: 'Shares dreamlike experiences that expand the collective imagery.',
        },
        chico: {
          name: 'CHICO',
          role: 'Participant',
          bio: 'Provides dream narratives to the dialogue between art and technology.',
        },
        erika: {
          name: 'Erika Gómez',
          role: 'Curator',
          bio: 'Investigates and articulates pieces with a focus on context and discourse.',
        },
        // Skills translations
        arte: 'Art',
        video: 'Video',
        plan: 'Plan',
        cine: 'Cinema',
        animacion: 'Animation',
        guion: 'Script',
        estudio: 'Study',
        gestion: 'Management',
        cultura: 'Culture',
        suenos: 'Dreams',
        relato: 'Narrative',
        poetica: 'Poetics',
        memoria: 'Memory',
        dialogo: 'Dialogue',
        teoria: 'Theory',
        curaduria: 'Curation',
        investigacion: 'Research',
        arquitectura: 'Architecture',
      },
    },
    // FANTASMA Section
    fantasma: {
      title: ' * FANTASMA ',
      description: 'Exploring the intersection of dreams and digital reality through machinima',
      projects: {
        dreamscape: {
          title: 'Digital Dreamscape',
          description: 'An exploration of subconscious narratives through interactive media.',
        },
        chaos: {
          title: 'Controlled Chaos',
          description: 'Where randomness meets intention in digital storytelling.',
        },
        convergence: {
          title: 'Reality Convergence',
          description: 'The merging of virtual and dream worlds in machinima form.',
        },
      },
    },
    
    // Contact Section
    contact: {
      title: "Let's Connect",
      description: "Ready to bring your ideas to life? Let's create something amazing together.",
      getInTouch: 'Get in Touch',
      intro: "I'm always excited to discuss new projects and opportunities. Whether you have a specific idea in mind or need guidance on your digital journey, I'm here to help.",
      contactInfo: {
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
      },
      followMe: 'Follow Me',
      form: {
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your.email@example.com',
        subject: 'Subject',
        subjectPlaceholder: "What's this about?",
        message: 'Message',
        messagePlaceholder: 'Tell me about your project...',
        sendMessage: 'Send Message',
      },
    },
    // Footer
    footer: {
      copyright: '© 2025 RANDOM. Created and Programmed by organic humans.',
      disclaimer: 'This artwork was created for artistic purposes and does not necessarily reflect objective information nor endorse any specific viewpoint. The content is for creative purposes and should not be interpreted as a representation of reality.',
    },
  },
  es: {
    // Navigation
    nav: {
      // home: 'Inicio', - removed
      about: 'Info',
      poems: 'Poemas',
      portfolio: 'Galería',
      services: 'Tripulación',
      fantasma: 'FNTSM',
      experience: 'Experiencia',
      contact: 'Contacto',
    },
    // Hero Section
    hero: {
      title: 'RANDOM',
      subtitle: 'Random nace del cruce entre lo onírico, lo político, el arte, el cine y la tecnología. Un espacio donde lo imaginado y lo vivido se mezclan, dando forma a relatos y paisajes que invitan a explorar desde otros lugares y experiencias.',
      description: '',
      viewPortfolio: 'Sueños',
      getInTouch: 'Pesadillas',
      work: 'TRABAJO',
      crew: 'EQUIPO',
      downloads: 'DESCARGAS',
      contact: 'CONTACTO',
    },
    // Poems Section
    poems: {
      title: 'Versos Digitales',
      description1: 'En el reino de la poesía digital, las palabras se transforman en entidades vivientes que danzan entre la realidad y la virtualidad. Aquí, los versos nacen de la intersección entre la emoción humana y la belleza algorítmica.',
      description2: 'Cada poema emerge como un fragmento de conciencia, capturado a través del lente del machinima y la narrativa digital. Los límites entre autor y algoritmo se difuminan en este espacio creativo.',
      description3: 'La poesía se convierte en un puente entre lo tangible y lo etéreo, donde cada palabra lleva el peso de los sueños y la ligereza de los susurros digitales. Estos versos desafían las estructuras narrativas tradicionales.',
      poeticElements: 'Elementos Poéticos',
      types: {
        narrative: 'Poesía Narrativa',
        lyrical: 'Expresión Lírica',
        emotional: 'Profundidad Emocional',
        experimental: 'Forma Experimental',
      },
    },
    // About Section
    about: {
      title: 'Sobre el Proyecto',
      description1: 'Durante el año 2020, muchos de nosotros jamás imaginamos vivir una pandemia. Jamás pensamos que tendríamos que pasar meses confinados en nuestros hogares, en cuarentena, para no contagiarnos. Ir al supermercado o salir a pasear suponía un riesgo de contraer la enfermedad. Estar expuestos a este riesgo constante generaba estados de ánimo marcados por la ansiedad, que en muchos casos se manifestaba a través de sueños experimentados con gran intensidad. Estos sueños vívidos, de alto contenido emotivo y visual, aparecían durante la etapa del sueño REM o rapid eye movement.',
      description2: 'La propuesta que presentamos trata de un proyecto de creación coautoral utilizando la video-instalación y la creación de un videojuego como medio principal de desarrollo y producción. Nos interesa explorar la intersección entre el videoarte, el cine, los videojuegos y su relación con los sueños como productores de fenómenos visuales y poéticos, a la vez que nos evocan diversos estados emocionales. A partir del análisis de sueños de 3 participantes que han sido invitados a compartirlos con nosotros, junto con la utilización de la plataforma GTA V de videojuego (MACHINIMA), quisimos darle vida a aquellos sueños generando imágenes en movimiento producidas desde el computador como video renderizado (diseño de escenarios, personajes y sonidos virtuales).',
      description3: 'Estas imágenes expresivas y surrealistas, de carácter cinematográfico, reflejan en su narrativa visual el artificio, un simulacro de universos narrativos no lineales, realidades alternativas y discursos apocalípticos y nostálgicos. En 2025, la experiencia se amplía con una versión unificada y renovada 2.0 que utiliza Unreal Engine, un motor gráfico que permite crear un entorno inmersivo 3D donde la geografía, el tiempo y las reglas se reconfiguran. Este espacio digital invita a explorar modos nuevos de habitar lo onírico, en una experiencia para visitantes que mezcla interactividad, juego y montaje audiovisual, potenciando el viaje sensorial y poético que ofrece la instalación.',
      coreStrengths: 'Fortalezas Principales',
      skills: {
        creativeThinking: 'Pensamiento Creativo',
        problemSolving: 'Resolución de Problemas',
        userExperience: 'Experiencia de Usuario',
        innovation: 'Innovación',
      },
    },
    // Portfolio Section
    portfolio: {
      title: 'Galería de Medios', // ✅ MAINTAINED as requested
      description: 'imágenes seleccionadas que muestran momentos clave del proyecto, junto con la opción de descargar la experiencia interactiva del videojuego. La galería te invita a sumergirte en el universo onírico que creamos, donde el arte, los sueños y la tecnología se encuentran para ofrecer una experiencia interactiva y sensorial. Es una oportunidad para vivir la obra desde dentro, jugando, explorando y conectando con los sueños que han sido transformados en arquitecturas y paisajes digitales.',
      projects: {
        organicEcommerce: {
          title: 'E-commerce Orgánico',
          description: 'Toda la información necesaria para conocer sobre el video juego RANDOM 2.0 realizado durante el año 2025.',
        },
        motionStudio: {
          title: 'Motion Studio',
          description: 'instalacion en museo MAC Forestal, toda la información al respecto y sus alcances culturales.',
        },
        forestDashboard: {
          title: 'Dashboard Forestal',
      description: 'Visualización y Descarga del catalalogo virtual. Información Backstage Adicional.',
        },
        naturePortfolio: {
          title: 'Portafolio Natural',
      description: 'Selección de imágenes y videos representativos del imaginario RANDOM durante los últimos años.',
        },
      },
    },
    // Services Section
    services: {
      title: 'Tripulación',
    description: 'Katherine Hoch y Eduardo Pino abren generosamente sus experiencias oníricas, invitándonos a explorar con sus sueños las fronteras entre lo real y lo imaginado. Camila Estrella, teórica y participante, aporta desde la reflexión y también comparte uno de los sueños que inspiró la obra. Sebastián Vidal, curador y teórico, acompaña guiando la visión general y el diálogo entre arte y tecnología. Barbara Oettinger, artista visual y realizadora, y Pepo Sabatini, cineasta y animador 3D, crearon conjuntamente el imaginario y la concepción estética del proyecto, fusionando visión creativa y técnica. Barbara aporta una mirada sensible y poética que atraviesa la propuesta, mientras que Pepo aporta su visión y expertice dentro del universo 3D. Cada uno, desde su lugar, construye un entramado colectivo que atraviesa el arte, la tecnología y los sueños.',
      webDevelopment: {
        title: 'PERONAS',
        description: 'Sitios web y aplicaciones personalizadas construidas con tecnologías modernas y principios de diseño orgánico.',
        features: ['React & Next.js', 'Backend Node.js', 'Integración de Base de Datos', 'Desarrollo de API'],
      },
      uiuxDesign: {
        title: 'PERSONAS',
        description: 'Interfaces hermosas e intuitivas que siguen patrones de diseño natural y mejoran la experiencia del usuario.',
        features: ['Investigación de Usuario', 'Wireframing', 'Prototipado', 'Sistemas de Diseño'],
      },
      mobileDevelopment: {
        title: 'Desarrollo Móvil',
        description: 'Aplicaciones web responsivas y aplicaciones móviles nativas optimizadas para todos los dispositivos.',
        features: ['Progressive Web Apps', 'React Native', 'Multiplataforma', 'Despliegue en App Store'],
      },
      performanceOptimization: {
        title: 'Optimización de Rendimiento',
        description: 'Acelera tu sitio web y mejora la experiencia del usuario con técnicas avanzadas de optimización.',
        features: ['Core Web Vitals', 'División de Código', 'Optimización de Imágenes', 'Estrategias de Caché'],
      },
      seoAnalytics: {
        title: 'SEO y Analíticas',
        description: 'Mejora tu visibilidad online y rastrea el rendimiento con SEO y analíticas integrales.',
        features: ['SEO Técnico', 'Google Analytics', 'Search Console', 'Monitoreo de Rendimiento'],
      },
      consultation: {
        title: 'Consultoría',
        description: 'Orientación estratégica para tus proyectos digitales, desde el concepto hasta la implementación exitosa.',
        features: ['Planificación de Proyectos', 'Selección de Stack Tecnológico', 'Diseño de Arquitectura', 'Entrenamiento de Equipos'],
      },
      crew: {
        barbara: {
          name: 'BÁRBARA OETTINGER',
          role: 'Creadora y Directora',
          bio: 'Desarrollo estructural Creativo, incorporando las Artes visuales como lenguaje central.',
        },
        pepo: {
          name: 'PEPO SABATINI',
          role: 'Creador y Director',
          bio: 'Desde el mundo del cine al video juego y también al revés.',
        },
        sebastian: {
          name: 'SEBASTIAN VIDAL',
          role: 'curador y teorico',
          bio: 'El ensamblaje de memoria y recuerdo, evocados por la huella y su busqueda.',
        },
        katherine: {
          name: 'KATHERINE HOCH',
          role: 'Participante',
          bio: 'Comparte sus experiencias oníricas para explorar lo real y lo imaginado.',
        },
        eduardo: {
          name: 'EDUARDO PINO',
          role: 'Participante',
          bio: 'Abre sus sueños al diálogo entre arte, tecnología y memoria.',
        },
        camila: {
          name: 'CAMILA ESTRELLA',
          role: 'Teórica y Participante',
          bio: 'Aporta reflexión y comparte uno de los sueños que inspiró la obra.',
        },
        chini: {
          name: 'CHINI',
          role: 'Participante',
          bio: 'Comparte experiencias oníricas que nutren la obra.',
        },
        yeikob: {
          name: 'YEIKOB',
          role: 'Participante',
          bio: 'Participa compartiendo experiencias oníricas que inspiran la obra.',
        },
        nacho: {
          name: 'NACHO',
          role: 'Participante',
          bio: 'Comparte experiencias oníricas que nutren el imaginario del proyecto.',
        },
        marco: {
          name: 'MARCO',
          role: 'Participante',
          bio: 'Comparte experiencias oníricas que amplían el imaginario colectivo.',
        },
        chico: {
          name: 'CHICO',
          role: 'Participante',
          bio: 'Aporta relatos de sueños al diálogo entre arte y tecnología.',
        },
        erika: {
          name: 'Erika Gómez',
          role: 'Curadora',
          bio: 'Investiga y articula piezas con foco en contexto y discurso.',
        },
        // Skills translations
        arte: 'Arte',
        video: 'Video',
        plan: 'Plan',
        cine: 'Cine',
        animacion: 'Animación',
        guion: 'Guión',
        estudio: 'Estudio',
        gestion: 'Gestión',
        cultura: 'Cultura',
        suenos: 'Sueños',
        relato: 'Relato',
        poetica: 'Poética',
        memoria: 'Memoria',
        dialogo: 'Diálogo',
        teoria: 'Teoría',
        curaduria: 'Curaduría',
        investigacion: 'Investigación',
        arquitectura: 'Arquitectura',
      },
    },
    // FANTASMA Section
    fantasma: {
      title: 'FANTASMA',
      description: 'Explorando la intersección de sueños y realidad digital a través del machinima',
      projects: {
        dreamscape: {
          title: 'Paisaje Digital de Sueños',
          description: 'Una exploración de narrativas subconscientes a través de medios interactivos.',
        },
        chaos: {
          title: 'Caos Controlado',
          description: 'Donde la aleatoriedad se encuentra con la intención en la narrativa digital.',
        },
        convergence: {
          title: 'Convergencia de Realidades',
          description: 'La fusión de mundos virtuales y oníricos en forma de machinima.',
        },
      },
    },
    
    // Contact Section
    contact: {
      title: 'Conectemos',
      description: '¿Listo para dar vida a tus ideas? Creemos algo increíble juntos.',
      getInTouch: 'Ponte en Contacto',
    intro: 'Siempre estamos emocionados de discutir nuevos proyectos y oportunidades. Si tienes una idea específica en mente o necesitas orientación en tu viaje digital, estamos aquí para ayudar.',
      contactInfo: {
        email: 'Correo',
        phone: 'Teléfono',
        location: 'Ubicación',
      },
      followMe: 'Sígueme',
      form: {
        name: 'Nombre',
        namePlaceholder: 'Tu nombre',
        email: 'Correo',
        emailPlaceholder: 'tu.correo@ejemplo.com',
        subject: 'Asunto',
        subjectPlaceholder: '¿De qué se trata?',
        message: 'Mensaje',
        messagePlaceholder: 'Cuéntame sobre tu proyecto...',
        sendMessage: 'Enviar Mensaje',
      },
    },
    // Footer
    footer: {
      copyright: '© 2025 RANDOM. Creado y Programado por humanos orgánicos.',
    },
  },
};

export const t = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

export type TopicDomain =
  | 'herb'
  | 'hydroponic'
  | 'database'
  | 'battery'
  | 'cinema_ai'
  | 'cinema_lgbtq'
  | 'education_ai'
  | 'cybersecurity'
  | 'climate_sustainability'
  | 'universal';

export function detectTopicDomain(topic: string, primaryKw: string): TopicDomain {
  const combined = `${topic} ${primaryKw}`.toLowerCase();

  // 1. Existing specific domains
  if ((combined.includes('growing herbs at home') || combined.includes('herb')) && !combined.includes('hydroponic')) {
    return 'herb';
  }
  if (combined.includes('hydroponic')) {
    return 'hydroponic';
  }
  if (combined.includes('database') || combined.includes('query latency') || combined.includes('indexing')) {
    return 'database';
  }
  if (combined.includes('solid state battery') || combined.includes('battery')) {
    return 'battery';
  }

  // 2. Cinema / Movie domains
  if (combined.includes('movie') || combined.includes('cinema') || combined.includes('filmmaking') || combined.includes('film')) {
    if (combined.includes('lgbtq') || combined.includes('queer') || combined.includes('representation')) {
      return 'cinema_lgbtq';
    }
    if (combined.includes('ai') || combined.includes('artificial intelligence') || combined.includes('vfx') || combined.includes('industry')) {
      return 'cinema_ai';
    }
  }
  if (combined.includes('lgbtq') || combined.includes('queer')) {
    return 'cinema_lgbtq';
  }

  // 3. Education domain
  if (combined.includes('education') || combined.includes('classroom') || combined.includes('learning') || combined.includes('teaching') || combined.includes('school')) {
    return 'education_ai';
  }

  // 4. Cybersecurity domain
  if (combined.includes('cybersecurity') || combined.includes('security') || combined.includes('privacy') || combined.includes('phishing') || combined.includes('password') || combined.includes('hack')) {
    return 'cybersecurity';
  }

  // 5. Climate / Sustainability domain
  if (combined.includes('climate') || combined.includes('sustainab') || combined.includes('environment') || combined.includes('carbon footprint') || combined.includes('renewable')) {
    return 'climate_sustainability';
  }

  return 'universal';
}

export interface DomainSectionData {
  h2: string;
  intro?: string;
  sub1H3: string;
  sub1Pool: string[];
  sub2H3: string;
  sub2Pool: string[];
  listItems?: string[];
}

export interface DomainTopicData {
  introPool: string[];
  s1: DomainSectionData;
  s2: DomainSectionData;
  s3: DomainSectionData;
  s4: {
    h2: string;
    pool: string[];
  };
}

// -----------------------------------------------------------------------------
// CINEMA AI DOMAIN
// -----------------------------------------------------------------------------
export const CINEMA_AI_DATA: DomainTopicData = {
  introPool: [
    'Artificial intelligence is rapidly transforming the cinematic landscape, influencing how stories are conceived, visualised, produced, and edited across global film industries. From indie filmmakers experimenting with generative pre-visualisation tools to major Hollywood studios exploring algorithmic workflows, AI in movie industry applications is changing traditional filmmaking paradigms.',
    'Modern directors and showrunners increasingly combine computational algorithms with human ingenuity to expand creative horizons. Rather than replacing human artistry, generative machine learning models and automated production pipelines serve as powerful creative accelerators throughout production.',
    'By automating complex technical processes, filmmakers can iterate rapidly during early development while managing demanding post-production schedules. This technological shift enables visionary storytellers to bring ambitious narrative concepts to the screen with unprecedented visual sophistication.',
    'The evolution of neural rendering and algorithmic production tools allows creative crews to test visual treatments and camera movements before setting foot on expensive physical stages.',
    'As the global entertainment market becomes more competitive, understanding how to harness intelligent automation responsibly has become essential for contemporary directors, cinematographers, and production executives.'
  ],
  s1: {
    h2: 'The Transformative Rise of AI in the Movie Industry',
    intro: 'The pre-production and visual development phases of filmmaking are undergoing a fundamental technological reimagining, driven by real-time neural modeling and generative visualization software.',
    sub1H3: 'Algorithmic script analysis and generative pre-visualization',
    sub1Pool: [
      'Screenwriters and creative development executives utilize natural language models to evaluate narrative pacing, identify structural weaknesses in screenplay drafts, and generate comprehensive scene breakdown schedules in minutes rather than days. This analytical speed allows creative development teams to spend more time refining character motivation and thematic depth.',
      'Generative concept art tools allow production designers and directors to translate narrative script descriptions into rich photorealistic visual mood boards instantaneously. This visual immediacy fosters creative alignment between department heads long before construction crews build physical sets.',
      'Algorithmic storyboarding engines generate dynamic 3D camera angles and lighting setups directly from written shot lists, providing directors with interactive animatics that optimize camera movement and blocking choices.',
      'Predictive script analytics help producers anticipate complex physical stunt requirements and location logistics early in development, avoiding costly last-minute production revisions.',
      'Collaborative digital story rooms allow international creative teams to brainstorm narrative story beats simultaneously with real-time semantic synthesis of visual ideas.',
      'By accelerating iterative creative prototyping, development executives can greenlight ambitious concepts with greater artistic clarity and reduced early exploratory financial overhead.'
    ],
    sub2H3: 'Revolutionizing digital visual effects and synthetic environments',
    sub2Pool: [
      'Digital visual effects departments employ neural rendering techniques to generate realistic background environments, digital crowd extensions, and complex atmospheric elements with remarkable computational efficiency. What once required hundreds of rendering hours across server farms can now be approximated in near real time.',
      'Machine learning models automate laborious rotoscoping and plate clean-up tasks, freeing digital visual artists to concentrate on high-level aesthetic nuance rather than frame-by-frame manual masking.',
      'Neural radiance fields and volumetric reconstruction enable visual effects supervisors to capture physical locations in three dimensions and re-light scenes dynamically in post-production.',
      'Synthetic character animation benefits from deep learning motion prediction, creating natural human kinesics and facial micro-expressions without manual keyframe adjustments.',
      'Automated background asset generation creates intricate textures and photorealistic foliage, allowing VFX supervisors to populate expansive fantasy or historical worlds seamlessly.',
      'Real-time denoising algorithms dramatically accelerate final-frame rendering passes, allowing digital effects teams to deliver polished visual spectacle under tight studio delivery deadlines.'
    ]
  },
  s2: {
    h2: 'Production Efficiency and Creative Augmentation Across Studios',
    intro: 'Beyond the camera lens, artificial intelligence streamlines complex editorial workflows and transforms soundstages into responsive real-time virtual production environments.',
    sub1H3: 'Streamlining post-production editing, color grading, and dubbing',
    sub1Pool: [
      'Editorial assistants deploy intelligent machine learning tools to ingest and synchronize multicamera footage automatically, catalog takes based on script supervisor notes, and generate preliminary rough cut assemblies according to established editing rules.',
      'Neural color grading algorithms analyze lighting variations across disparate shooting days and balance exposure and chromatic palettes instantly, giving colorists a cohesive creative foundation.',
      'Advanced voice isolation models clean up contaminated location dialogue by filtering out intrusive background hums, wind rumble, and generator noise without dulling the natural emotional tone of actor performances.',
      'Neural dubbing platforms analyze phonetic speech movements and translate dialogue into international languages while adjusting vocal cadence to preserve original emotional delivery.',
      'Automated sound effect classification systems match Foley footsteps and ambient soundscapes to on-screen movements, dramatically reducing time spent searching extensive audio libraries.',
      'Intelligent metadata tagging and semantic search allow editors to locate specific character line deliveries or visual cutaways across hundreds of hours of raw footage in seconds.'
    ],
    sub2H3: 'Virtual production stages and real-time machine learning rendering',
    sub2Pool: [
      'Virtual production soundstages utilize LED volume walls driven by real-time game engines and machine learning parallax correction, allowing cameras to capture in-camera visual effects with realistic physical lighting and reflections.',
      'Predictive camera tracking algorithms smooth out motion data and eliminate spatial latency, ensuring background virtual environments match camera focal length and perspective shifts perfectly.',
      'Machine learning systems dynamically adjust the color temperature and illumination of LED wall panels to match ambient foreground studio lamps, creating seamless optical integration between physical actors and synthetic backgrounds.',
      'Virtual set modifications, such as shifting the position of distant mountains or altering the time of day, occur instantaneously without stopping live filming schedules.',
      'Actors perform within fully realized immersive environments rather than blank green screens, inspiring more authentic emotional reactions and spatial awareness during takes.',
      'Virtual scouting applications allow cinematographers to explore digital sets in virtual reality before shooting, planning precise camera lens packages and crane setups in advance.'
    ],
    listItems: [
      '- Deploy generative concept art tools for rapid visual storyboarding and set design.',
      '- Leverage neural audio models for automated location dialogue cleanup and multi-language dubbing.',
      '- Apply machine learning models to optimize camera tracking and synthetic background lighting.',
      '- Establish strict data rights frameworks to protect digital actor likenesses and voice assets.',
      '- Integrate real-time rendering engines into virtual production soundstages for instantaneous VFX feedback.'
    ]
  },
  s3: {
    h2: 'Ethical Considerations, Creative Rights, and the Labor Landscape',
    intro: 'The rapid adoption of artificial intelligence in cinema brings critical legal, ethical, and creative responsibilities that require thoughtful studio governance and industry consensus.',
    sub1H3: 'Protecting actor likenesses, voice rights, and creative copyright',
    sub1Pool: [
      'The ability to synthesize photorealistic digital doubles and replicate human vocal performance creates pressing legal questions regarding performer consent, estate control, and fair compensation. Entertainment guilds and studios are actively negotiating comprehensive contractual frameworks to guarantee artists retain sovereignty over their digital personas.',
      'Legal teams must navigate complex copyright precedents regarding training data, ensuring that machine learning models utilized in studio productions respect original intellectual property without infringing on protected artistic works.',
      'Transparent documentation protocols require productions to disclose where synthetic imagery or voice cloning is employed, establishing clear provenance across theatrical releases and streaming catalogs.',
      'Posthumous digital recreations demand stringent ethical guidelines and family consent, preventing unauthorized commercial exploitation of deceased historical icons and performers.',
      'Independent filmmakers require affordable legal templates to verify that third-party AI plugins comply with international intellectual property and fair use regulations.',
      'Watermarking technologies and cryptographic provenance registries offer emerging tools to certify human authorship and track synthetic content generation across digital media supply chains.'
    ],
    sub2H3: 'Balancing technological innovation with human artistic vision',
    sub2Pool: [
      'At its core, cinema is a deeply human storytelling medium rooted in empathy, cultural nuance, and authentic lived experience. While algorithmic tools can optimize production workflows, the guiding creative vision, emotional subtext, and thematic soul of any film must remain firmly in human hands.',
      'Relying solely on predictive machine learning models risks homogenizing storytelling around past box-office tropes, making human directorial risk-taking and unconventional narrative voices more essential than ever.',
      'Film schools and vocational academies are updating curricula to teach emerging filmmakers how to direct algorithmic tools thoughtfully without surrendering their unique creative voice.',
      'Fostering collaborative partnerships between software engineers and seasoned cinematic craftspeople ensures technological innovation addresses real-world artistic needs rather than superficial novelty.',
      'Celebrating human vulnerability and spontaneous artistic choices on set reminds audiences why live human performance remains the beating heart of compelling drama.',
      'Industry leaders who champion responsible, human-centered technological adoption will establish standard practices that empower artists while safeguarding the creative integrity of the medium.'
    ]
  },
  s4: {
    h2: 'Conclusion: The Collaborative Future of AI in the Movie Industry',
    pool: [
      'Artificial intelligence represents one of the most transformative technical developments in modern film history, offering unprecedented creative leverage to independent visionaries and major studios alike. By integrating machine learning into pre-visualization, visual effects, and post-production editing while maintaining clear ethical standards, the entertainment community can unlock bold new forms of visual storytelling.',
      'As cinematic technology continues to evolve, the most successful filmmakers will be those who embrace algorithmic tools as collaborative creative partners rather than replacements for human imagination. Explore current virtual production suites, evaluate automated editorial workflows, and bring your unique cinematic stories to life with confidence.',
      'The future of the silver screen belongs to storytellers who balance technical fluency with profound emotional depth. Take your first exploratory step into modern filmmaking tools today and discover new dimensions in visual narrative craft.',
      'Embracing intelligent tools with artistic discipline empowers filmmakers to push aesthetic boundaries while telling stories that resonate deeply across global cultures.',
      'By grounding technological innovation in authentic human perspective, modern filmmakers will shape an inspiring, inclusive, and visually breathtaking cinematic future.'
    ]
  }
};

// -----------------------------------------------------------------------------
// LGBTQ+ CINEMA DOMAIN
// -----------------------------------------------------------------------------
export const CINEMA_LGBTQ_DATA: DomainTopicData = {
  introPool: [
    'The evolution of LGBTQ+ representation in modern cinema marks a profound cultural transformation, moving from coded subtext and tragic stereotypes to authentic, multifaceted, and celebrated human storytelling. Today, queer cinematic narratives command international box-office attention, critically acclaimed festival honours, and prominent placement across global streaming platforms.',
    'Portraying diverse sexualities and gender identities on screen validates lived experiences, dismantles historical prejudices, and fosters empathy among worldwide audiences. Modern audiences increasingly demand rich, nuanced queer characters whose lives encompass love, joy, friendship, and ambition beyond narrow coming-out conflicts.',
    'From groundbreaking independent cinema movements to mainstream Hollywood studio productions, filmmakers are redefining how LGBTQ+ stories are written, funded, cast, and directed. This artistic renaissance expands narrative boundaries and celebrates the rich intersectionality of contemporary queer communities.',
    'Pioneering filmmakers and actors have spent decades challenging restrictive industry codes, paving the way for authentic representation that resonates across generations of moviegoers.',
    'Understanding the historical milestones, contemporary triumphs, and ongoing challenges facing queer cinema provides vital insight into how visual culture reflects and propels social change.'
  ],
  s1: {
    h2: 'The Evolution of LGBTQ+ Representation in Modern Cinema',
    intro: 'Examining the historical trajectory of queer characters on screen illustrates a steady progression from marginalization toward narrative complexity and creative autonomy.',
    sub1H3: 'Breaking historical barriers and early independent milestones',
    sub1Pool: [
      'For much of classic Hollywood history, regulatory censorship frameworks such as the Hays Code strictly prohibited overt depictions of homosexual relationships, forcing queer narratives into veiled subtext, villainous caricatures, or comedic fodder. Despite these constraints, visionary directors embedded subtle visual motifs that queer audiences recognized and embraced.',
      'The emergence of the New Queer Cinema movement in the early 1990s revolutionized independent filmmaking. Visionary directors produced fearless, aesthetically bold films that rejected assimilationist respectability politics and portrayed queer lives with uncompromising artistic urgency.',
      'Early film festivals, including Sundance and the Berlin International Film Festival, established dedicated exhibition spaces like the Teddy Award, providing vital exposure and distribution lifelines for marginalized queer filmmakers.',
      'Independent micro-budget productions proved that queer stories possessed passionate, dedicated audiences eager to support narratives reflecting their authentic community realities.',
      'Grassroots queer film collectives pooled modest resources to document community struggles during pivotal social eras, leaving behind an invaluable cinematic archive of resilience.',
      'These independent pioneers dismantled industry assumptions regarding commercial viability, demonstrating that emotionally honest queer narratives could captivate international film critics and audiences alike.'
    ],
    sub2H3: 'Complex character arcs beyond tragic tropes and stereotypes',
    sub2Pool: [
      'Historically, cinematic narratives frequently subjected LGBTQ+ characters to the pervasive trope where queer figures met tragic deaths or suffered severe psychological punishment before the closing credits. Modern filmmakers deliberately reject this formula, centering narratives on joy, everyday domesticity, and triumphant personal fulfillment.',
      'Contemporary queer cinema embraces expansive genre storytelling, placing LGBTQ+ protagonists at the heart of romantic comedies, space exploration epics, supernatural horror, and coming-of-age adventures rather than confining them strictly to historical trauma dramas.',
      'Character writing has evolved to reflect internal contradictions, personal flaws, and moral dilemmas, allowing queer characters to exist as complete, complex human beings rather than idealized didactic symbols.',
      'Stories exploring multi-generational LGBTQ+ relationships bridge historical perspectives, depicting mentorship, chosen family bonds, and cultural legacy within queer communities.',
      'Subverting conventional romantic structures enables films to celebrate platonic queer intimacy, community solidarity, and chosen family dynamics with cinematic gravitas.',
      'By diversifying narrative trajectories, modern cinema demonstrates that queer existence encompasses a vast spectrum of human emotion, triumphs, and everyday experiences.'
    ]
  },
  s2: {
    h2: 'Cultural Impact and Mainstream Cinematic Recognition',
    intro: 'The transition of queer cinema from niche independent circuits into mainstream awards acclaim and international cultural consciousness represents a watershed cultural moment.',
    sub1H3: 'Authentic casting and intersectional queer storytelling',
    sub1Pool: [
      'Industry conversations increasingly champion the importance of authentic casting, recognizing that LGBTQ+ actors bring invaluable lived experience, cultural nuance, and emotional truth to queer roles. Casting queer performers also directly counters historical industry marginalization where openly LGBTQ+ artists were systematically denied major dramatic opportunities.',
      'Intersectional storytelling highlights the diverse experiences within the LGBTQ+ community, exploring how sexuality and gender identity intersect dynamically with race, ethnicity, socioeconomic class, disability, and immigration status.',
      'Films centering transgender, non-binary, and gender non-conforming protagonists are breaking new ground, moving beyond sensationalized medical transitions toward intimate explorations of personal agency and self-actualization.',
      'Collaborations between established screenwriters and community cultural consultants ensure character dialogue, cultural references, and interpersonal dynamics ring true to specific subcultures.',
      'Hiring queer directors, cinematographers, and production designers behind the camera ensures the visual aesthetic avoids exploitative voyeurism and centers authentic community gaze.',
      'Intersectional representation enriches the cinematic canon, ensuring that audiences from all backgrounds see their multifaceted identities reflected respectfully on the big screen.'
    ],
    sub2H3: 'Global reception, box office success, and festival acclaim',
    sub2Pool: [
      'Prestigious international film accolades, including Academy Awards, the Cannes Film Festival Queer Palm, and the Venice Golden Lion, have recognized landmark queer films as high-water marks of modern dramatic storytelling. These critical triumphs prove that intimate queer narratives achieve universal emotional resonance.',
      'Mainstream studio releases featuring LGBTQ+ protagonists have achieved impressive global box-office success, disproving the outdated commercial myth that general audiences will not support queer-led features.',
      'International streaming services have democratized access to queer cinema, delivering award-winning films directly to viewers living in regions where local theaters refuse to program LGBTQ+ titles.',
      'Word-of-mouth social media campaigns and viral audience advocacy frequently transform independent queer films into global cultural phenomena, propelling indie releases into commercial prominence.',
      'Youth-oriented queer romantic narratives find massive international audiences online, creating supportive global digital communities that celebrate on-screen queer joy together.',
      'Commercial viability and critical acclaim together create a virtuous cycle that encourages studios and independent financiers to greenlight bolder, more diverse queer scripts.'
    ],
    listItems: [
      '- Prioritize authentic casting and diverse lived experiences across production teams.',
      '- Move beyond repetitive coming-out narratives toward diverse, multifaceted human stories.',
      '- Partner with independent film festivals to broaden reach and community dialogue.',
      '- Champion intersectional representation that reflects nuanced racial, cultural, and gender identities.',
      '- Protect creative integrity against regional market censorship pressures.'
    ]
  },
  s3: {
    h2: 'Ongoing Challenges and the Future of Inclusive Filmmaking',
    intro: 'While meaningful progress has been achieved, queer filmmakers continue to confront commercial, regulatory, and systemic obstacles in bringing their work to global audiences.',
    sub1H3: 'Navigating international distribution and censorship hurdles',
    sub1Pool: [
      'Filmmakers and international sales agents face stringent censorship regulations and outright distribution bans in conservative global territories where depictions of LGBTQ+ relationships remain legally restricted or socially stigmatized. Balancing international commercial distribution with artistic integrity presents a persistent challenge.',
      'Some major corporate distributors have faced criticism for excising brief queer scenes or background references to secure theatrical clearance in restrictive international markets, sparking debate over creative compromise versus commercial revenue.',
      'Independent grassroots film collectives organize encrypted digital screenings and underground film festivals in regions facing state censorship, providing safe spaces for community viewing.',
      'International film advocacy organizations provide legal guidance and emergency funding for persecuted queer filmmakers whose artistic work puts them at personal risk.',
      'Digital direct-to-consumer platforms and decentralized distribution models offer promising alternatives for reaching viewers in territories where mainstream theatrical exhibition remains inaccessible.',
      'Resisting censorship pressures protects the authentic voices of queer storytellers and maintains solidarity with audiences living under repressive legislative environments.'
    ],
    sub2H3: 'Empowering diverse creators behind and in front of the camera',
    sub2Pool: [
      'Long-term cultural change requires expanding access to development funding, production grants, and executive leadership roles for underrepresented queer creators, particularly queer women, transgender artists, and filmmakers of color who remain underrepresented in studio executive suites.',
      'Mentorship programs and film lab fellowships provide emerging queer writers and directors with essential industry connections, packaging advice, and distribution strategy guidance.',
      'Industry unions and film commissions are establishing inclusive hiring benchmarks and anti-discrimination policies to ensure film sets maintain safe, welcoming environments for all crew members.',
      'Independent queer production companies and philanthropic film funds provide crucial early-stage financing, allowing daring scripts to enter production without compromising their narrative boldness.',
      'Building sustainable creative ecosystems ensures that queer filmmakers can build enduring multi-film careers rather than being treated as isolated novelty successes.',
      'Investing in diverse behind-the-camera talent guarantees that the future of cinema will be shaped by a rich mosaic of unique, authentic perspectives.'
    ]
  },
  s4: {
    h2: 'Conclusion: Championing Authentic LGBTQ+ Stories in Modern Cinema',
    pool: [
      'The journey of LGBTQ+ representation in modern cinema is an inspiring testament to artistic courage, cultural resilience, and the transformative power of visual storytelling. As queer cinema continues to expand into diverse genres, authentic casting, and intersectional narratives, it enriches the global film landscape for moviegoers everywhere.',
      'Supporting inclusive cinema requires active participation from audiences, critics, and industry leaders alike. Seek out independent queer films, attend community film festival screenings, and champion diverse storytellers who dare to share their authentic truths with the world.',
      'Every ticket purchased, festival attended, and film recommended sends a clear signal that diverse stories matter and deserve celebration. Discover an acclaimed LGBTQ+ film today and experience the emotional power of authentic storytelling.',
      'By celebrating queer voices both in front of and behind the camera, we help build an entertainment culture where every person can see their humanity reflected with dignity and joy.',
      'The continuing renaissance of queer cinema promises an exciting, boundless future where human stories are told without apology, limitation, or compromise.'
    ]
  }
};

// -----------------------------------------------------------------------------
// AI IN EDUCATION DOMAIN
// -----------------------------------------------------------------------------
export const EDUCATION_AI_DATA: DomainTopicData = {
  introPool: [
    'Artificial intelligence is revolutionizing the global educational landscape, fundamentally transforming how teachers instruct, how students learn, and how academic institutions operate. By adapting to individual cognitive paces and providing real-time personalized feedback, AI in education tools are helping educators create more dynamic, supportive, and inclusive learning environments.',
    'Rather than replacing classroom teachers, intelligent educational platforms empower educators by automating time-consuming administrative tasks and offering deep diagnostic insights into student comprehension. This pedagogical shift restores instructional time for meaningful mentorship, critical discussions, and creative problem solving.',
    'From intelligent tutoring systems to multimodal assistive learning applications, AI tools address diverse learning needs across elementary, secondary, and higher education. Understanding how to leverage these technological innovations effectively is becoming an essential priority for modern educators and institutional leaders.',
    'By providing immediate formative feedback and tailored practice exercises, adaptive algorithms help prevent students from falling behind in challenging academic subjects.',
    'As academic technology evolves, educational communities must balance technological capability with human empathy, digital equity, and responsible student data privacy.'
  ],
  s1: {
    h2: 'How AI in Education Is Reshaping Modern Classrooms',
    intro: 'Integrating artificial intelligence into instructional workflows introduces new paradigms of individualized instruction that accommodate varied learning speeds and academic backgrounds.',
    sub1H3: 'Personalized learning pathways and adaptive tutoring platforms',
    sub1Pool: [
      'Adaptive learning software continuously analyzes student performance on practice exercises, instantly diagnosing conceptual misunderstandings and adjusting problem difficulty dynamically. This individualized responsiveness ensures advanced students remain intellectually challenged while struggling learners receive targeted remediation before moving forward.',
      'Intelligent tutoring systems simulate one-on-one pedagogical guidance, providing scaffolded hints and interactive explanations that guide students toward solutions rather than simply revealing final answers. This conversational approach builds independent critical thinking skills.',
      'Learners gain agency over their academic progress through personalized dashboards that visualize subject mastery, highlight strengths, and recommend tailored review modules aligned with their unique goals.',
      'Adaptive curriculum platforms support differentiated instruction in mixed-ability classrooms, allowing a single instructor to manage varied student learning trajectories without unsustainable workload.',
      'Spaced repetition algorithms schedule review quizzes at scientifically optimized intervals, strengthening long-term memory retention and conceptual reinforcement across diverse disciplines.',
      'By accommodating individual cognitive learning curves, intelligent learning systems help students build academic self-confidence and develop positive attitudes toward challenging subjects.'
    ],
    sub2H3: 'Automating administrative workflows to empower instructional time',
    sub2Pool: [
      'Teachers spend substantial weekly hours on routine administrative responsibilities, including grading standardized assignments, logging attendance records, and generating progress reports. Machine learning tools automate repetitive grading tasks, returning valuable hours to teachers for direct classroom instruction and student mentorship.',
      'Automated formative assessment tools analyze student written responses, highlighting grammatical inconsistencies, conceptual gaps, and organizational weaknesses instantly. This gives teachers a comprehensive overview of class comprehension prior to subsequent lesson planning.',
      'Intelligent scheduling systems optimize classroom resource allocations, laboratory equipment rotations, and parent-teacher conference schedules, reducing logistical friction across school districts.',
      'Automated lesson planning assistants help educators draft comprehensive curriculum outlines, generate engaging discussion prompts, and align classroom materials with regional academic standards.',
      'Relieving educators of administrative exhaustion prevents teacher burnout, promoting higher instructional morale and fostering longer career retention within the educational sector.',
      'When instructional time is protected from administrative overload, teachers can dedicate their creative energy to fostering genuine personal relationships with their students.'
    ]
  },
  s2: {
    h2: 'Enhancing Student Engagement and Educational Accessibility',
    intro: 'Artificial intelligence bridges critical accessibility gaps by delivering multimodal learning tools that empower students with diverse physical, linguistic, and neurodivergent learning profiles.',
    sub1H3: 'Multimodal learning aids for diverse learning styles and abilities',
    sub1Pool: [
      'Speech-to-text and real-time captioning technologies enable deaf and hard-of-hearing students to engage fully with spoken lectures and class discussions without relying on delayed transcriptions.',
      'Text-to-speech engines with natural vocal inflections assist students with dyslexia, visual impairments, and reading comprehension hurdles, allowing them to absorb complex academic texts through auditory channels.',
      'Real-time neural translation tools break down linguistic barriers for non-native language learners, translating educational materials and classroom lectures into dozens of native tongues simultaneously.',
      'Interactive visual simulations and generative diagramming tools transform abstract mathematical and scientific theories into tangible, manipulative models that visual and kinesthetic learners can explore intuitively.',
      'Customizable reading interfaces allow neurodivergent students to modify font spacing, color contrasts, and reading pacing to minimize cognitive fatigue during intense study sessions.',
      'Providing universally accessible digital learning tools ensures that every student, regardless of physical or cognitive variation, receives equitable educational opportunities.'
    ],
    sub2H3: 'Intelligent analytics for identifying early learning intervention needs',
    sub2Pool: [
      'Predictive analytics dashboards monitor student homework completion, platform engagement, and quiz trajectories to detect early warning signs of academic distress weeks before formal term exams occur.',
      'Early identification protocols alert academic counselors and teachers when a student exhibits patterns consistent with conceptual confusion or emotional disengagement, triggering timely personalized support.',
      'Longitudinal learning analytics highlight systemic curriculum bottlenecks where large cohorts of students consistently stumble, informing proactive institutional curriculum revisions.',
      'Machine learning models differentiate between procedural execution errors and fundamental conceptual misunderstandings, helping teachers tailor targeted small-group intervention workshops.',
      'Parent communication portals provide actionable summaries of student progress, enabling families to reinforce learning strategies constructively at home.',
      'Data-informed pedagogical interventions reduce dropout rates and improve academic achievement by addressing student challenges before they compound into insurmountable obstacles.'
    ],
    listItems: [
      '- Implement adaptive learning platforms that adjust problem difficulty in real time.',
      '- Automate repetitive assessment workflows to restore dedicated mentoring time for educators.',
      '- Integrate intelligent tutoring systems with multimodal audio, visual, and tactile learning aids.',
      '- Establish rigorous data privacy controls to safeguard sensitive student information.',
      '- Mitigate algorithmic training biases to maintain fair, equitable outcomes across all student demographics.'
    ]
  },
  s3: {
    h2: 'Navigating Ethical Challenges, Data Privacy, and Digital Equity',
    intro: 'Deploying artificial intelligence across educational ecosystems requires robust ethical guardrails, rigorous student data protection, and proactive measures to prevent digital inequality.',
    sub1H3: 'Protecting student data privacy and mitigating algorithmic bias',
    sub1Pool: [
      'Educational institutions gather immense volumes of sensitive student data, including academic records, behavioral logs, and cognitive performance metrics. Schools must enforce strict data governance standards, end-to-end encryption, and full compliance with student privacy regulations such as FERPA, COPPA, and GDPR.',
      'Commercial educational technology vendors must guarantee that student interactions are never harvested for behavioral advertising, commercial profiling, or third-party monetization.',
      'Algorithmic bias represents a severe risk if diagnostic models are trained on non-representative student demographics, potentially leading to unfair evaluation patterns or inaccurate academic tracking.',
      'Institutions must establish transparent algorithmic audits to verify that predictive intervention systems evaluate all students equitably across diverse cultural, racial, and socioeconomic backgrounds.',
      'Educators and students should receive training in digital data hygiene, understanding how their educational information is processed, stored, and protected within cloud platforms.',
      'Prioritizing ethical transparency builds enduring trust among parents, educators, and students as new technological tools enter the academic sphere.'
    ],
    sub2H3: 'Bridging the digital divide to ensure universal educational access',
    sub2Pool: [
      'The benefits of educational AI risk widening existing socioeconomic achievement gaps if advanced adaptive platforms are accessible only to affluent private academies and well-funded suburban school districts.',
      'Government agencies and educational philanthropies must collaborate to fund high-speed broadband access, modern computing devices, and subsidized software licenses for rural and low-income urban schools.',
      'Open-source educational AI models and lightweight offline learning applications offer promising solutions for resource-constrained schools with limited internet connectivity.',
      'Comprehensive professional development programs must train teachers across all school districts, ensuring that instructors feel confident integrating intelligent pedagogical tools into daily lessons.',
      'Equitable access initiatives must include multilingual software support to ensure immigrant communities and multilingual learners benefit equally from academic innovations.',
      'Closing the digital divide guarantees that artificial intelligence serves as a democratic engine for universal educational empowerment rather than an amplifier of inequality.'
    ]
  },
  s4: {
    h2: 'Conclusion: Fostering Human-Centered AI in Education',
    pool: [
      'Artificial intelligence in education offers immense promise for creating more adaptive, accessible, and personalized learning journeys for students worldwide. By automating routine administrative burdens, providing real-time formative feedback, and supporting diverse learning styles, intelligent tools empower teachers to focus on the compassionate, human heart of education.',
      'The successful integration of AI in education ultimately depends on human leadership, ethical vigilance, and an unwavering commitment to educational equity. Explore adaptive learning tools in your classroom, participate in pedagogical AI workshops, and advocate for student-centered digital policies in your school community.',
      'As educational technology advances, keeping human relationships at the center of the learning process ensures students develop both technical competence and empathetic wisdom. Take your first proactive step toward modernizing education today.',
      'Empowering teachers with intelligent tools enriches the entire educational community, cultivating curious, resilient lifelong learners prepared for a dynamic world.',
      'Through collaborative innovation, ethical data governance, and equitable access, we can create an educational future where every student has the tools and support to thrive.'
    ]
  }
};

// -----------------------------------------------------------------------------
// CYBERSECURITY IN EVERYDAY LIFE DOMAIN
// -----------------------------------------------------------------------------
export const CYBERSECURITY_DATA: DomainTopicData = {
  introPool: [
    'In an increasingly connected world, practicing strong cybersecurity in everyday life has transformed from a specialized technical concern into a fundamental life skill. From online banking and social media to smart home appliances and connected vehicles, our personal and financial lives are woven into digital networks that require vigilant defense.',
    'Cybercriminals continuously refine automated scanning tools, deceptive phishing schemes, and identity theft techniques targeting ordinary consumers. Fortunately, establishing robust digital security does not require an advanced computer science degree, but rather consistent, disciplined daily habits and sensible configuration choices.',
    'By adopting proven authentication practices, maintaining software updates, and learning to identify modern social engineering tactics, individuals can dramatically reduce their digital vulnerability. Taking control of personal cybersecurity provides peace of mind and safeguards family assets against modern online threats.',
    'Proactive digital hygiene protects not only your immediate devices, but also shields friends, family members, and professional colleagues from being targeted through your compromised accounts.',
    'Understanding the primary digital threat vectors and establishing a structured defense routine ensures you navigate the online landscape with confidence and resilience.'
  ],
  s1: {
    h2: 'Understanding Cybersecurity in Everyday Life',
    intro: 'Developing an effective personal defense strategy begins with recognizing how digital adversaries exploit human trust and identifying the foundational controls that neutralize their tactics.',
    sub1H3: 'Recognizing common digital threat vectors and phishing schemes',
    sub1Pool: [
      'Phishing remains the single most widespread attack vector facing everyday computer users. Cybercriminals construct deceptive emails, SMS messages, and direct messages that closely mimic legitimate banks, postal services, or popular streaming platforms, attempting to harvest credentials or install malware.',
      'Modern phishing schemes frequently employ psychological urgency, threatening account suspension or claiming fraudulent transactions to panic recipients into clicking dangerous links without verifying sender legitimacy.',
      'Spear-phishing attacks utilize publicly accessible personal details gathered from social media profiles to craft personalized messages that appear remarkably convincing to unsuspecting victims.',
      'Malicious advertising and fraudulent search engine sponsored links redirect users toward cloned banking portals designed to capture login information and credit card numbers.',
      'Developing the habit of scrutinizing sender email domains, hovering over hyperlinks to preview destination URLs, and avoiding unsolicited attachments prevents the vast majority of social engineering compromises.',
      'When in doubt regarding an urgent account notification, navigate directly to the official service website via a saved bookmark rather than following links embedded in unexpected messages.'
    ],
    sub2H3: 'The importance of multi-factor authentication and credential hygiene',
    sub2Pool: [
      'Reusing identical or slightly varied passwords across multiple online accounts creates catastrophic cascading vulnerability. When a single third-party service suffers a data breach, attackers execute automated credential-stuffing attacks to compromise accounts across thousands of other platforms.',
      'Deploying a dedicated password manager allows users to generate and securely store unique, complex passphrases for every single account, eliminating the impossible mental burden of memorizing dozens of passwords.',
      'Multi-factor authentication (MFA) introduces an indispensable secondary verification barrier, requiring an authentication prompt, one-time token, or physical hardware security key before granting account access.',
      'Authenticator applications and hardware security keys provide vastly superior protection compared to SMS text verification codes, which remain vulnerable to cellular SIM-swapping attacks.',
      'Passkeys utilizing FIDO2 biometric authentication represent the modern gold standard, replacing traditional passwords with cryptographically signed tokens that are mathematically immune to phishing.',
      'Auditing your password vault semi-annually and changing any flagged or compromised credentials ensures your authentication perimeter remains uncompromised over time.'
    ]
  },
  s2: {
    h2: 'Securing Personal Devices, Home Networks, and Digital Identities',
    intro: 'Securing physical hardware and home Wi-Fi networks ensures that connected personal devices do not become entry points for malicious intrusion.',
    sub1H3: 'Hardening home Wi-Fi routers and connected smart IoT devices',
    sub1Pool: [
      'The home Wi-Fi router serves as the digital front door to every connected device in your household. Leaving default administrative credentials unchanged allows attackers within wireless range to compromise router settings and redirect DNS traffic.',
      'Homeowners should immediately update the router administrative password to a strong, unique passphrase and enable WPA3 wireless encryption to protect Wi-Fi network traffic from unauthorized eavesdropping.',
      'Configuring an isolated guest Wi-Fi network specifically for smart home appliances, connected televisions, and IoT gadgets prevents a compromised smart lightbulb from exposing personal laptops and financial data.',
      'Disabling remote router administration ensures the management interface can only be accessed by physical connection from within the local household network.',
      'Checking for and applying router firmware updates on a quarterly basis patches critical security vulnerabilities discovered in network hardware.',
      'Renaming the wireless network SSID to avoid revealing your family name, street address, or router model helps preserve residential digital privacy.'
    ],
    sub2H3: 'Safe mobile computing, automatic software updates, and data backups',
    sub2Pool: [
      'Software updates and operating system patches deliver crucial security fixes that close known software vulnerabilities actively exploited by cybercriminals. Enabling automatic updates on smartphones, laptops, and web browsers ensures critical patches apply immediately.',
      'Public unsecured Wi-Fi networks in airports, cafes, and hotels expose network traffic to intercepting attacks. Utilizing a trustworthy encrypted Virtual Private Network (VPN) or relying on cellular hotspot connections shields sensitive web traffic while travelling.',
      'Maintaining the 3-2-1 backup strategy protects valuable personal files against devastating ransomware extortion: keep three copies of important data across two different media types, with one copy stored securely offsite or in an encrypted cloud backup vault.',
      'Reviewing application permissions on mobile devices prevents rogue games and utilities from harvesting background location data, contacts, microphone audio, and camera access without genuine need.',
      'Enabling biometric device locks, remote tracking, and remote wipe capabilities ensures that lost or stolen smartphones cannot be exploited by opportunistic criminals.',
      'Uninstalling unused browser extensions and legacy software reduces your digital attack surface and improves overall device performance.'
    ],
    listItems: [
      '- Enable multi-factor authentication across all sensitive personal and financial accounts.',
      '- Deploy a dedicated password manager to generate and store unique complex credentials.',
      '- Maintain automatic security updates across operating systems, browsers, and mobile devices.',
      '- Segment smart home IoT devices onto an isolated guest Wi-Fi network.',
      '- Schedule regular automated backups to secure external storage or encrypted cloud vaults.'
    ]
  },
  s3: {
    h2: 'Data Privacy, Online Scams, and Proactive Threat Defense',
    intro: 'Minimizing your digital footprint and exercising vigilance against evolving financial scams preserves long-term financial security and identity integrity.',
    sub1H3: 'Safeguarding personal financial records and sensitive personal data',
    sub1Pool: [
      'Placing a proactive security freeze on your credit reports with major credit bureaus prevents identity thieves from opening fraudulent credit cards, loans, or mortgages in your name, even if your Social Security number is exposed in a data breach.',
      'Enabling real-time transaction notification alerts on all banking accounts and credit cards ensures you receive immediate push notifications whenever money is charged, facilitating instantaneous dispute resolution.',
      'Exercising data minimization on social media platforms prevents attackers from piecing together biographical information, such as mother’s maiden names, childhood pet names, or birth dates often used in security recovery questions.',
      'Utilizing disposable email aliases and virtual payment cards hides your actual permanent email and banking details when shopping with unfamiliar online merchants.',
      'Shredding physical financial statements, pre-approved credit offers, and sensitive mail before disposal prevents low-tech dumpster-diving identity theft in residential neighborhoods.',
      'Requesting data broker removals systematically deletes personal phone numbers and home addresses from commercial public directory databases.'
    ],
    sub2H3: 'Developing resilient digital habits against modern social engineering',
    sub2Pool: [
      'Modern voice cloning scams utilize brief audio samples from social media videos to simulate the distress calls of family members, demanding urgent bail money or emergency funds. Establishing a private family passphrase confirms genuine identity before taking emergency financial action.',
      'Technical support scams utilize browser pop-ups warning of phantom virus infections to coerce victims into granting remote desktop access. Legitimate technology companies never initiate unsolicited phone calls or pop-ups demanding remote computer control.',
      'Investment scams promising guaranteed returns through cryptocurrency platforms frequently manipulate victims over extended messaging relationships before disappearing with invested capital.',
      'Practicing healthy skepticism when encountering unsolicited investment advice, celebrity endorsements, or unsolicited job offers protects savings from predatory financial operations.',
      'Reporting confirmed scams to national consumer protection agencies and local law enforcement helps authorities track criminal infrastructure and warn other vulnerable citizens.',
      'Sharing digital security knowledge with elderly relatives and younger family members establishes a culture of collaborative protection across your entire social circle.'
    ]
  },
  s4: {
    h2: 'Conclusion: Practicing Strong Cybersecurity in Everyday Life',
    pool: [
      'Developing strong cybersecurity in everyday life habits is a continuous, empowering commitment to safeguarding your digital identity, personal privacy, and financial well-being. By adopting password managers, activating multi-factor authentication, securing home networks, and remaining alert against social engineering, you build a resilient defense that deters digital adversaries.',
      'Security is not an all-or-nothing proposition; every single defensive measure you implement significantly raises the difficulty barrier for opportunistic cybercriminals. Select one critical action today—such as activating multi-factor authentication on your primary email—and begin strengthening your digital defenses.',
      'Taking control of your online security empowers you to enjoy the convenience of modern connected technology without living in fear of digital compromise. Make digital safety an integral part of your daily routine today.',
      'Protecting your digital assets creates a safer online ecosystem for your family, workplace, and broader community.',
      'With consistent vigilance and simple defensive routines, you can navigate the digital world securely and confidently throughout every stage of your life.'
    ]
  }
};

// -----------------------------------------------------------------------------
// CLIMATE CHANGE & SUSTAINABLE LIVING DOMAIN
// -----------------------------------------------------------------------------
export const CLIMATE_SUSTAINABILITY_DATA: DomainTopicData = {
  introPool: [
    'The urgent challenge of global climate change calls for meaningful, sustained action across every sector of human society, beginning with the daily habits and lifestyle choices we make in our homes and communities. Embracing sustainable living is not about achieving flawless eco-perfection, but rather making deliberate, positive choices that reduce carbon emissions, conserve natural resources, and protect ecological diversity.',
    'From household energy efficiency and plant-forward nutrition to mindful transit and zero-waste consumption, everyday actions carry measurable collective power. When individual households adopt sustainable habits, they reduce direct ecological strain while driving commercial market demand for greener products and services.',
    'Transitioning toward environmental sustainability frequently delivers immediate secondary benefits, including lower utility bills, healthier living environments, and deeper community connections. Understanding where your lifestyle intersects with ecological impact empowers you to make practical, lasting contributions to planetary health.',
    'By replacing feelings of climate anxiety with purposeful, structured daily routines, individuals discover that sustainable living is both deeply rewarding and profoundly practical.',
    'Exploring the core principles of ecological stewardship allows households to build sustainable foundations that inspire neighbors, civic leaders, and future generations.'
  ],
  s1: {
    h2: 'Understanding Climate Change and Sustainable Living',
    intro: 'Building an impactful sustainable lifestyle begins with understanding how residential energy use, dietary choices, and consumption habits contribute to personal carbon footprints.',
    sub1H3: 'Assessing household ecological footprints and resource consumption',
    sub1Pool: [
      'A personal carbon footprint measures the total greenhouse gas emissions generated directly and indirectly by an individual or household. Conducting a comprehensive home energy and lifestyle audit helps identify your highest-impact emission sources, allowing you to prioritize changes that deliver genuine ecological results.',
      'Residential heating, cooling, and electricity consumption typically account for the largest proportion of domestic emissions in temperate and cold climates. Tracking monthly kilowatt-hour consumption highlights seasonal heating and cooling spikes that can be mitigated through targeted insulation upgrades.',
      'Direct emissions from burning fossil fuels in home furnaces, water heaters, and personal gasoline vehicles represent immediate opportunities for clean technological substitution.',
      'Indirect emissions embedded in the manufacturing, shipping, and packaging of consumer goods often exceed direct energy consumption, emphasizing the importance of circular consumption habits.',
      'Utilizing free online carbon footprint calculators provides a clear baseline metric against which households can measure annual progress toward lower emissions.',
      'Focusing initial conservation efforts on high-impact lifestyle categories prevents decision fatigue and yields substantial early emission reductions.'
    ],
    sub2H3: 'Energy conservation, renewable adoption, and home electrification',
    sub2Pool: [
      'Improving residential thermal efficiency through air sealing, weatherstripping, and attic insulation represents the most cost-effective first step toward home decarbonization, preventing conditioned air from leaking while slashing heating demands.',
      'Transitioning from fossil gas heating to high-efficiency electric heat pumps provides year-round climate control while dramatically reducing household greenhouse gas emissions.',
      'Installing a smart programmable thermostat optimizes heating and cooling schedules around daily family routines, preventing energy waste when rooms are unoccupied.',
      'Switching all household lighting to modern LED bulbs reduces lighting electricity consumption by up to eighty percent while eliminating the frequent replacement waste of incandescent filaments.',
      'Homeowners can install rooftop photovoltaic solar arrays to generate clean zero-emission electricity on site, while renters and apartment dwellers can enroll in community solar programs or utility green energy tariffs.',
      'Electrifying domestic appliances, such as replacing gas cooking ranges with induction cooktops, improves indoor air quality while decoupling cooking from fossil fuel infrastructure.'
    ]
  },
  s2: {
    h2: 'Practical Daily Habits for Reducing Environmental Impact',
    intro: 'Transforming daily routines across grocery shopping, meal preparation, and transportation delivers steady, cumulative reductions in domestic resource consumption.',
    sub1H3: 'Adopting zero-waste food practices and responsible consumption',
    sub1Pool: [
      'Food waste decomposing in municipal landfills is a primary generator of atmospheric methane, a potent greenhouse gas. Deliberate weekly meal planning, proper produce storage, and creative utilization of leftovers prevent household food from spoiling and ending up in waste bins.',
      'Incorporating plant-forward meal planning by swapping meat-heavy dishes for legumes, whole grains, and seasonal vegetables significantly decreases the land, water, and emission burdens associated with industrial livestock agriculture.',
      'Backyard composting or participating in municipal organic waste collection diverts food scraps from landfills, transforming organic waste into nutrient-rich compost that enriches soil and sequesters carbon.',
      'Practicing mindful consumption by prioritizing durable, repairable, and second-hand goods counters the rapid waste cycles generated by disposable fast-fashion and planned obsolescence.',
      'Carrying reusable shopping totes, produce bags, and stainless steel water bottles eliminates hundreds of single-use plastic containers from entering municipal waste streams each year.',
      'Supporting local farmers markets and regional growers reduces food miles while bolstering local agricultural resilience and seasonal eating habits.'
    ],
    sub2H3: 'Sustainable mobility, active transit, and mindful travel choices',
    sub2Pool: [
      'Transportation represents one of the largest single contributors to personal carbon emissions. Replacing short solo car trips with active commuting options, such as walking, cycling, or riding electric scooters, eliminates vehicle exhaust while promoting personal physical cardiovascular health.',
      'Utilizing electrified municipal transit systems, such as subways, light rail, and electric bus networks, dramatically reduces per-passenger emissions compared to private vehicle commuting.',
      'Organizing workplace carpools or coordinating shared neighborhood errands maximizes vehicle occupancy and cuts fuel expenses in half for participating households.',
      'When vehicle replacement is necessary, transitioning to an electric vehicle or plug-in hybrid eliminates tailpipe emissions and takes advantage of increasingly green electrical grids.',
      'Evaluating business and vacation travel by choosing rail transit over domestic aviation where available minimizes the intense emissions associated with short-haul flights.',
      'Embracing remote work options and virtual meetings eliminates daily commuting miles entirely, providing both environmental savings and recovered personal time.'
    ],
    listItems: [
      '- Conduct a residential energy audit to identify thermal leaks and insulation gaps.',
      '- Transition household heating and cooking to energy-efficient electric heat pumps.',
      '- Minimize single-use plastics by adopting durable, reusable circular household goods.',
      '- Incorporate plant-forward meal planning to significantly lower daily dietary carbon footprints.',
      '- Support community solar programs and regional municipal clean transit initiatives.'
    ]
  },
  s3: {
    h2: 'Community Engagement, Policy Support, and Systemic Climate Action',
    intro: 'While personal lifestyle changes are vital, connecting individual efforts to community initiatives and civic policy multiplies ecological impact exponentially.',
    sub1H3: 'Amplifying grassroots environmental initiatives and circular economies',
    sub1Pool: [
      'Participating in community gardens transforms underutilized urban lots into productive green spaces, fostering biodiversity, lowering localized urban heat island effects, and providing fresh local produce to neighborhood residents.',
      'Neighborhood tool libraries and equipment sharing co-operatives allow residents to borrow specialized lawnmowers, power tools, and camping gear, eliminating the need for every household to purchase seldom-used items.',
      'Attending local repair cafes connects residents with skilled volunteer fixers who restore broken appliances, clothing, and bicycles, keeping valuable materials out of landfills.',
      'Organizing neighborhood seed swaps and perennial plant exchanges encourages urban biodiversity and strengthens community social bonds through shared green passions.',
      'Volunteering for municipal tree planting and riparian zone restoration projects helps restore native ecosystems and protects communities against extreme climate weather events.',
      'Grassroots environmental initiatives demonstrate that collective local stewardship creates vibrant, resilient, and socially cohesive neighborhoods.'
    ],
    sub2H3: 'Supporting climate resilience policies and sustainable consumer choices',
    sub2Pool: [
      'Civic advocacy at the local municipal level empowers citizens to support protected bicycle infrastructure, pedestrian-friendly urban zoning, and comprehensive municipal compost collection programs.',
      'Voting for elected representatives who prioritize ambitious clean energy targets, public transit funding, and industrial emission standards ensures government policy aligns with climate science.',
      'Directing personal consumer spending toward certified B-Corporations, green-certified businesses, and eco-conscious producers incentivizes corporate supply chains to accelerate decarbonization.',
      'Divesting personal banking and retirement savings from fossil fuel extraction into clean energy funds aligns financial capital with environmental values.',
      'Engaging with school boards and local universities to advocate for campus renewable energy installations and environmental education curricula inspires future generations.',
      'Combining conscious consumer choices with persistent civic participation establishes the systemic momentum necessary to achieve comprehensive societal decarbonization.'
    ]
  },
  s4: {
    h2: 'Conclusion: Embracing Sustainable Living for a Resilient Future',
    pool: [
      'Embracing sustainable living is an empowering, hopeful journey that connects daily choices to the collective stewardship of our planet. By improving household energy efficiency, adopting mindful dietary and transit habits, and advocating for progressive community policies, every individual can play an active role in confronting climate change.',
      'Lasting ecological transformation begins with small, steady commitments that integrate naturally into your everyday life. Choose one meaningful action today—whether insulating your water heater, planning meatless meals, or biking to work—and build momentum toward a cleaner, healthier future.',
      'Every positive environmental choice you make ripples outward, inspiring family, friends, and neighbors to take action. Embrace sustainable habits today and help cultivate a thriving world for generations to come.',
      'Living sustainably enriches daily life with simplicity, purpose, and a renewed appreciation for the natural living world around us.',
      'Together, through intentional daily choices and united community action, we possess the power to build a resilient, carbon-neutral, and abundant global future.'
    ]
  }
};

// -----------------------------------------------------------------------------
// UNIVERSAL DYNAMIC TOPIC BUILDER (FOR ARBITRARY USER TOPICS)
// -----------------------------------------------------------------------------
export function buildUniversalTopicPools(topic: string, primaryKw: string, audience: string): DomainTopicData {
  const cleanTopic = topic.trim();
  const cleanKw = primaryKw.trim();
  const cleanAudience = audience.trim();

  return {
    introPool: [
      `Developing a comprehensive understanding of ${cleanKw} is one of the most effective ways for ${cleanAudience.toLowerCase()} to achieve meaningful, long-term results in ${cleanTopic}. By focusing on foundational principles, evidence-based methods, and a disciplined approach, practitioners can navigate complex challenges with confidence and clarity.`,
      `Starting with a solid structural framework is the secret to sustained progress. Rather than attempting advanced tactics prematurely, successful initiatives build momentum through consistent execution of proven fundamentals. When you integrate ${cleanKw} into your strategic routines, ongoing optimization becomes natural and rewarding.`,
      `A systematic approach to ${cleanTopic} eliminates common trial-and-error setbacks while maximizing operational efficiency and strategic leverage. By adhering to verified industry standards, teams and individuals can avoid costly missteps and unlock predictable, repeatable outcomes.`,
      `Mastering ${cleanKw} requires balancing conceptual depth with practical implementation and rigorous progress monitoring. Developing these core competencies establishes a robust platform for long-term capability and enduring success.`,
      `As the landscape surrounding ${cleanTopic} continues to evolve, staying grounded in sound principles ensures you adapt proactively to emerging developments without losing strategic focus.`
    ],
    s1: {
      h2: `Understanding the Core Principles of ${cleanKw}`,
      intro: `Sound principles and clear conceptual definitions form the bedrock of any successful initiative in ${cleanTopic}, enabling practitioners to adapt smoothly as operational requirements shift.`,
      sub1H3: `Essential terminology and conceptual framework`,
      sub1Pool: [
        `Begin by establishing precise operational definitions and baseline terminology for ${cleanKw}. When all participants share a coherent conceptual vocabulary, evaluating tools, following guidelines, and collaborating on complex tasks becomes significantly faster and more enjoyable.`,
        `Document foundational concepts and workflows clearly in accessible reference guides, ensuring that team members and collaborators can execute standard procedures with consistent accuracy and minimal friction.`,
        `Focus deeply on core structural mechanics before exploring specialized edge cases or complex configurations that introduce unnecessary operational overhead.`,
        `Clarify the underlying rationale behind key procedural requirements so team members understand not merely what actions to take, but why those steps are indispensable for success.`,
        `Analyze real-world examples and reference models to see how theoretical concepts translate into practical application across diverse operational environments.`,
        `Establishing clear conceptual mastery early prevents costly misunderstandings and lays the groundwork for seamless workflow execution.`
      ],
      sub2H3: `Strategic priorities for ${cleanAudience}`,
      sub2Pool: [
        `Tailor your overall approach to the specific operational realities and constraints of ${cleanAudience.toLowerCase()}. Focusing on solutions that resolve high-friction challenges delivers immediate value while building confidence across participating teams.`,
        `Prioritize reliable, thoroughly tested methodologies that have demonstrated consistent results across comparable peer environments over unproven, speculative novelties.`,
        `Establish measurable baseline criteria at the project outset to evaluate early progress objectively and identify areas requiring fine-tuning without subjective guesswork.`,
        `Align day-to-day tactical activities with overarching strategic milestones to ensure that short-term efforts directly support long-term goals.`,
        `Engage key stakeholders early in the planning process to incorporate diverse perspectives, build consensus, and streamline subsequent organizational adoption.`,
        `Maintaining disciplined focus on core strategic priorities ensures steady momentum and prevents scope creep from diluting project effectiveness.`
      ]
    },
    s2: {
      h2: `Practical Methodologies and Implementation Frameworks`,
      intro: `Structured methodologies and well-designed implementation workflows protect valuable time, reduce execution bottlenecks, and ensure reliable quality standards.`,
      sub1H3: `Structured deployment workflows and best practices`,
      sub1Pool: [
        `Establish a logical, phased sequence for rolling out ${cleanKw} initiatives. Breaking complex projects into manageable, sequential milestones allows teams to maintain control, verify quality at each stage, and celebrate incremental wins.`,
        `Utilize comprehensive pre-execution checklists to confirm that all technical prerequisites, team resources, and environment settings are fully verified before starting live operations.`,
        `Standardize operational templates and procedural guidelines so routine tasks are carried out consistently regardless of individual personnel rotations.`,
        `Implement clear review protocols at critical project junctures to validate that deliverables satisfy established quality standards before proceeding to subsequent stages.`,
        `Foster open communication channels across operational teams, facilitating rapid knowledge sharing and proactive coordination during time-sensitive tasks.`,
        `Adhering to structured workflows minimizes operational friction, enhances execution predictability, and maximizes overall return on effort.`
      ],
      sub2H3: `Optimizing execution efficiency and continuous iteration`,
      sub2Pool: [
        `Continuous refinement represents the cornerstone of operational excellence. Regularly review performance data, gather structured feedback from end users, and implement targeted micro-adjustments to improve workflow velocity and output quality.`,
        `Identify and eliminate redundant procedural steps that consume valuable time without contributing to final strategic deliverables or quality benchmarks.`,
        `Automate repetitive manual tasks using dependable software tools, freeing team members to concentrate on strategic problem-solving and creative development.`,
        `Document lessons learned and process improvements systematically, transforming experiential insights into permanent institutional knowledge.`,
        `Schedule regular optimization reviews to verify that existing workflows continue to meet operational demands as project scale and complexity grow.`,
        `Cultivating a culture of continuous iteration ensures that your implementation remains agile, efficient, and resilient against unexpected operational challenges.`
      ],
      listItems: [
        `- Establish clear performance baselines before implementing procedural changes for ${cleanKw}.`,
        `- Document standard operational protocols to ensure repeatable, consistent outcomes.`,
        `- Conduct structured weekly reviews to evaluate progress against core milestones.`,
        `- Gather stakeholder feedback early to detect potential bottlenecks before deployment.`,
        `- Allocate dedicated time for ongoing iteration and data-informed adjustments.`
      ]
    },
    s3: {
      h2: `Overcoming Critical Challenges and Scaling for Success`,
      intro: `Sustaining long-term success requires diagnosing emerging challenges proactively, avoiding common beginner mistakes, and establishing scalable operational architectures.`,
      sub1H3: `Diagnosing bottlenecks and common pitfalls`,
      sub1Pool: [
        `The most frequent pitfall in ${cleanTopic} is rushing into advanced configurations before mastering foundational competencies. Skipping basic preparation inevitably leads to inconsistent results, operational confusion, and unnecessary troubleshooting delays.`,
        `Monitor key performance indicators systematically to detect emerging operational anomalies before they escalate into substantial bottlenecks that derail project timelines.`,
        `Avoid the temptation to implement drastic procedural overhauls in response to minor deviations; instead, apply focused, incremental adjustments and measure their impact carefully.`,
        `Consult verified reference documentation, peer benchmarks, and authoritative industry best practices when diagnosing unexpected challenges or performance dips.`,
        `Encourage team members to surface potential obstacles early without fear of blame, fostering a transparent environment where challenges are addressed collaboratively.`,
        `Methodical problem diagnosis prevents wasted effort, protects operational momentum, and ensures solutions address root causes rather than superficial symptoms.`
      ],
      sub2H3: `Measuring tangible outcomes and driving continuous improvement`,
      sub2Pool: [
        `Establish clear, quantifiable metrics that reflect genuine progress rather than superficial vanity indicators. Tracking meaningful outcomes ensures leadership remains informed and resources are allocated effectively.`,
        `Maintain structured logs of operational experiments, configuration changes, and measured results, creating an empirical record that guides future strategic decisions.`,
        `Celebrate milestones and recognize team contributions systematically, reinforcing positive execution habits and maintaining high organizational morale over extended campaigns.`,
        `Conduct periodic capability reviews to identify emerging skill gaps and provide targeted training opportunities that elevate overall team proficiency.`,
        `Engage with wider industry communities and professional networks to benchmark your progress and incorporate innovative practices developed by leading peer organizations.`,
        `Rigorous outcome measurement transforms subjective guesswork into data-driven confidence, driving sustained excellence throughout the project lifecycle.`
      ]
    },
    s4: {
      h2: `Conclusion: Mastering ${cleanKw} for Long-Term Success`,
      pool: [
        `Developing confidence and mastery in ${cleanKw} is an empowering step toward sustained excellence in ${cleanTopic}. By understanding core principles, executing structured implementation workflows, and committing to continuous data-driven refinement, you can achieve reliable, high-impact outcomes across every initiative.`,
        `Realizing lasting success does not require overwhelming complexity; rather, it demands patient dedication to proven fundamentals and consistent execution. Select your primary strategic objective today, apply the methodologies outlined in this guide, and take your first concrete action with ${cleanKw}.`,
        `As you build experience and deepen your practical familiarity, continue to refine your approaches, share knowledge with colleagues, and pursue continuous growth with clarity and determination.`,
        `Mastering fundamental techniques establishes an enduring foundation that enables you to embrace future opportunities and navigate evolving landscapes with confidence.`,
        `Commit to excellence, monitor your progress with discipline, and unlock the full potential of your work in ${cleanTopic} today.`
      ]
    }
  };
}

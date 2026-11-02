import { countWords } from './text.js';
import {
  TopicDomain,
  detectTopicDomain,
  CINEMA_AI_DATA,
  CINEMA_LGBTQ_DATA,
  EDUCATION_AI_DATA,
  CYBERSECURITY_DATA,
  CLIMATE_SUSTAINABILITY_DATA,
  buildUniversalTopicPools,
  DomainTopicData
} from './topicPools.js';

export { TopicDomain, detectTopicDomain };

export interface AdaptiveOutlineSection {
  h2: string;
  h3: string[];
  purpose: string;
  targetWords: number;
}

export interface AdaptiveOutline {
  intro: string;
  sections: AdaptiveOutlineSection[];
}

export interface AdaptiveArticleParams {
  topic: string;
  primaryKeyword: string;
  audience: string;
  targetWords: number;
  expectedH1?: string;
  outlineSections?: AdaptiveOutlineSection[];
}

// -----------------------------------------------------------------------------
// Herb Garden Topic Pool
// -----------------------------------------------------------------------------
const HERB_INTRO_POOL = [
  'Fresh basil on your windowsill sounds like a luxury, but an indoor herb garden is one of the easiest ways to bring vibrant flavour into everyday home cooking. You do not need an outdoor allotment or expensive equipment to enjoy fresh herbs throughout the season. With a bright windowsill, good pots, and a simple watering routine, anyone can start harvesting fragrant leaves within weeks.',
  'Starting small is the secret to long-term success. Rather than purchasing ten varieties at once, begin with two or three versatile culinary staples like basil, mint, and parsley. When you grow an indoor herb garden right on your kitchen counter, adding homegrown herbs to meals becomes a natural, daily habit.',
  'Cultivating culinary greens indoors provides year-round freshness regardless of outside weather conditions or garden size. By understanding the core growth requirements of light, drainage, and gentle pruning, beginner gardeners can avoid common pitfalls and achieve abundant harvests from compact living spaces.',
  'Home-grown culinary herbs elevate simple recipes with immediate aroma and nutrient richness that store-bought produce cannot match. Creating a sustainable kitchen garden requires no elaborate greenhouse equipment, but rather a methodical approach to environmental balance, soil composition, and root vitality.',
  'Fresh herbs also bring natural beauty and refreshing fragrances directly into residential kitchens, turning sunlit windows into miniature culinary sanctuaries.'
];

const HERB_S1_INTRO = 'Light is the single most critical factor for healthy kitchen herbs. Most Mediterranean culinary herbs require at least six hours of bright, direct sunlight each day to produce the essential oils responsible for their aromatic flavor.';
const HERB_S1_SUB1_POOL = [
  'South-facing windowsills receive the strongest, most consistent light throughout the day, making them the premier location for sun-loving plants like rosemary and thyme. If south-facing glass is unavailable, an east-facing window that captures morning sun offers a gentle second choice. Be cautious during winter months, as cold drafts leaking through windowpanes can shock tender root systems.',
  'Rotate your containers ninety degrees every few days to prevent leggy growth as stems bend toward the glass. Cleaning window glass regularly also maximizes light transmission during cloudy seasons.',
  'During intense midsummer heat, monitor foliage closely on south-facing glass, as radiant heat amplification can scorch delicate leaf tips. Moving pots just three inches back from hot panes maintains high luminosity while preventing thermal stress.',
  'In older homes with single-pane windows, winter condensation can elevate ambient moisture around foliage while chilling container soil. Placing an insulating cork coaster beneath pots shields root balls from frigid sill temperatures.',
  'Observe the angle of incidence as seasons change; sun rays penetrate deeper into rooms during autumn and winter, shifting the sweet spot of direct illumination away from the immediate window glass.',
  'If you notice elongated pale stems with sparse leaf nodes, your herbs are signaling insufficient light. Relocating them to a brighter exposure immediately restores compact, bushy growth.'
];
const HERB_S1_SUB2_POOL = [
  'When natural daylight is limited during darker winter seasons, compact LED grow lights provide an affordable and reliable boost. Position the light approximately six to ten inches above the foliage, setting a timer for twelve hours daily to simulate a full summer day.',
  'Modern full-spectrum LED fixtures consume minimal electricity while providing balanced red and blue wavelengths that promote stocky vegetative growth without excessive heat emission.',
  'Adjust the fixture height as plants grow taller to maintain optimal photon delivery without scorching uppermost leaves. Consistent photoperiods keep phototropic hormones balanced throughout winter.',
  'Pairing LED lights with an inexpensive mechanical timer eliminates the risk of irregular lighting schedules that trigger premature flowering or leaf drop in light-sensitive herbs.',
  'Look for lamps rated around five thousand Kelvin for crisp white illumination that blends attractively with interior home decor while fulfilling photosynthetically active radiation requirements.',
  'Supplementing natural light during cloudy stretches ensures steady cellular energy production, preventing the seasonal dormancy that often halts indoor harvests in temperate zones.'
];

const HERB_S2_INTRO = 'Healthy roots require air circulation as much as moisture. Standard garden soil from outdoors is too dense for containers and will quickly suffocate container-grown herbs.';
const HERB_S2_SUB1_POOL = [
  'Select containers that are at least six inches deep with dedicated drainage holes at the base. Standing water is the fastest route to root rot. Always place a saucer underneath each pot to catch excess runoff, and empty the pooled water fifteen minutes after watering.',
  'Terracotta pots naturally wick moisture away through porous clay walls, making them ideal for drought-tolerant herbs, whereas glazed containers help moisture-loving herbs retain steady hydration.',
  'Avoid planting multiple herb varieties with conflicting moisture requirements in a single shared planter. Give each species its own dedicated pot to tailor soil conditions precisely.',
  'Ensure the saucer has adequate capacity so runoff does not spill onto wooden sills. Elevating pots slightly inside saucers using small pebbles keeps drainage holes clear of standing water.',
  'Fabric containers and breathable felt pouches offer another excellent option for indoor growers, air-pruning root tips naturally to foster dense, fibrous root architectures.',
  'When reusing older pots from previous seasons, wash them thoroughly with warm water to remove lingering mineral crusts and prevent transferring soil-borne micro-organisms.'
];
const HERB_S2_SUB2_POOL = [
  'Use a premium indoor potting mix that includes perlite or vermiculite. These amendments keep the soil light, porous, and aerated, allowing delicate roots to expand freely without becoming waterlogged.',
  'Re-pot herbs once roots begin circling the bottom of the container. Refresh topsoil annually with organic compost to replenish microbial activity and preserve soil structure.',
  'Inspect drainage holes periodically to ensure potting mix does not obstruct water flow. Maintaining a soil pH between 6.0 and 7.0 promotes optimal micronutrient assimilation for culinary herbs.',
  'Denser soils trap stagnant water around root tips, depriving cells of oxygen and inviting fungal pathogens that cause rapid leaf yellowing.',
  'Coarse perlite particles create microscopic air channels through the root zone, ensuring roots breathe freely even immediately following thorough irrigation.',
  'Adding a thin top dressing of clean horticultural grit discourages fungus gnats from laying eggs in moist container media while giving displays a polished culinary presentation.'
];
const HERB_S2_LIST_ITEMS = [
  '- Choose terracotta pots for herbs like rosemary that prefer drier root zones.',
  '- Use glazed ceramic or plastic containers for thirsty herbs like mint and chives.',
  '- Mix in a small handful of worm castings for slow-release natural nutrition.',
  '- Incorporate coarse horticultural sand to enhance drainage for Mediterranean varieties.',
  '- Avoid heavy outdoor garden loam that compacts tightly in containers.',
  '- Check drainage holes monthly to prevent mineral encrustation and root obstruction.'
];

const HERB_S3_INTRO = 'Overwatering kills far more indoor plants than neglect. Herbs thrive best when their soil is allowed to dry out slightly between waterings, encouraging deeper root development.';
const HERB_S3_SUB1_POOL = [
  'Before reaching for the watering can, insert your index finger two inches into the potting mix. If the soil feels damp and cool, wait another day or two. If it feels dry and crumbly, give the pot a thorough drink until water trickles from the drainage hole.',
  'Water container plants early in the morning so surface moisture evaporates before evening, which reduces the chance of fungal spores taking hold on stems.',
  'Use room-temperature tap water that has rested overnight, allowing dissolved chlorine to dissipate while avoiding thermal shock to delicate root hair cells.',
  'Observe leaf posture as a secondary diagnostic signal: slight morning wilting indicates thirst, whereas yellowing lower leaves accompanied by damp soil signal excessive watering.',
  'Bottom-watering represents an outstanding technique for sensitive culinary herbs: place pots in a shallow water tray for twenty minutes, allowing soil capillaries to draw moisture upward evenly.',
  'Adjust your watering frequency dynamically as household humidity shifts between winter heating cycles and humid summer mornings.'
];
const HERB_S3_SUB2_POOL = [
  'Regular harvesting actually promotes healthier, bushier growth. Always pinch stems just above a set of leaf nodes rather than pulling off individual leaves from the bottom. This simple pruning technique triggers the stem to branch into two new growing shoots, doubling your harvest.',
  'Never remove more than one-third of the total foliage at any single trimming session, giving the plant adequate leaf area to continue photosynthesis and recover quickly.',
  'Pinch off any flowering flower buds immediately as they appear, as flowering diverts energy away from foliage and turns leaves bitter.',
  'Clean your harvesting shears with rubbing alcohol between plants to prevent the accidental transfer of sap-borne microbes or plant viruses.',
  'Harvest during morning hours after morning dew has dried but before intense midday sun warms the leaves, locking in peak essential oil concentration and aroma.',
  'Store freshly harvested sprigs upright in a small glass of water on your counter rather than refrigerating them, preserving crisp texture and intense herbal fragrances.'
];

const HERB_S4_POOL = [
  'Cultivating your own indoor herb garden is an easy, rewarding step toward more flavorful everyday meals. By matching your lighting conditions, choosing containers with proper drainage, and mastering the simple soil-check watering routine, you can enjoy crisp, aromatic herbs all year. Pick your two favorite culinary herbs, set them on your brightest windowsill, and harvest your first fresh sprig this week.',
  'With consistent observation and basic care, your kitchen will always have fresh ingredients on hand. Start simple, observe how your plants respond, and expand your indoor herb garden one pot at a time.',
  'Tending to fresh herbs daily connects you to the natural rhythms of plant life while enhancing your culinary creations. Establish your windowsill garden today and experience the satisfaction of harvesting fresh flavor on demand.',
  'Small daily attentions yield fragrant culinary rewards. Transform any sunlit counter into a thriving herbal haven with healthy, aromatic foliage throughout every season.',
  'Embrace the journey of indoor cultivation and enjoy the immediate culinary transformation fresh herbs bring to every home-cooked meal.'
];

// -----------------------------------------------------------------------------
// Hydroponic Topic Pool
// -----------------------------------------------------------------------------
const HYDRO_INTRO_POOL = [
  'Indoor hydroponic gardening is one of the most rewarding ways for urban homeowners to enjoy fresh, crisp vegetables without owning an outdoor yard. By cultivating plants in water enriched with essential mineral nutrients rather than garden soil, you can grow vibrant leafy greens and herbs directly inside your living room or kitchen.',
  'Soil-less cultivation eliminates messy potting mix, weeds, and many common soil-borne garden pests. Whether you live in a compact city apartment or a suburban townhouse, adopting indoor hydroponic gardening lets you harvest fresh produce throughout every season with remarkable water and space efficiency.',
  'Hydroponic setups recycle nutrient water continuously in closed-loop systems, using up to ninety percent less water than conventional outdoor soil cultivation. By providing direct access to balanced mineral ions, crops grow significantly faster with exceptional nutrient density.',
  'Managing clean indoor reservoirs ensures reliable food safety without dependence on synthetic pesticides or unpredictable outdoor weather conditions.',
  'Cultivating fresh vegetables in water brings living greenery and vibrant culinary abundance directly into modern residential living spaces.'
];

const HYDRO_S1_INTRO = 'Selecting an appropriate growing method is the first step toward a thriving home garden. While commercial greenhouses use complex industrial arrangements, domestic setups require simple, clean, and reliable designs that fit neatly into tight residential spaces.';
const HYDRO_S1_SUB1_POOL = [
  'Deep Water Culture (DWC) is the most forgiving method for beginners. In a DWC system, plant roots hang suspended through small net pots into an aerated reservoir of water and dissolved nutrients. An aquarium air pump connected to porous air stones supplies continuous oxygen directly to the root zone, preventing root suffocation and promoting rapid growth. Nutrient Film Technique (NFT), by contrast, recirculates a shallow stream of nutrient solution over roots through gently sloping channels, which suits larger crops but requires careful pump maintenance.',
  'Keep water temperatures in DWC reservoirs between eighteen and twenty-one degrees Celsius to maintain high dissolved oxygen saturation.',
  'Inspect net pots periodically to confirm roots spread freely into the aerated bubbling zone without tangling excessively around air lines.',
  'Clean circulation pump intake screens every fortnight to prevent mineral debris from restricting nutrient solution recirculation.',
  'Monitor water reservoir levels daily to prevent submersible pump impellers from running dry and cavitating.',
  'Insulate exterior reservoir walls during winter to prevent cold air drafts from dropping water solution temperatures below active root absorption thresholds.'
];
const HYDRO_S1_SUB2_POOL = [
  'When floor space is restricted, vertical hydroponic towers provide an ideal solution. Vertical towers stack growing ports in a cylindrical column, pumping nutrient solution to the top and letting it cascade downward over the roots. This configuration uses vertical height rather than horizontal floor space, enabling homeowners to grow twenty or more plants in a two-foot square corner.',
  'Vertical systems operate quietly and fit comfortably into kitchen corners or enclosed balcony areas without generating excess moisture.',
  'Ensure the base reservoir is anchored securely on level flooring to prevent tilting as top-heavy crops reach maturity.',
  'Use lightweight food-grade plastic components that resist ultraviolet degradation and clean easily between crop replanting cycles.',
  'Position vertical towers on durable catch basins to protect residential flooring during routine reservoir drain cycles.',
  'Rotate vertical tower orientations weekly if using natural window light to guarantee balanced foliage density across all perimeter ports.'
];

const HYDRO_S2_INTRO = 'Plants grown indoors cannot rely entirely on natural sunlight filtered through residential window glass. Providing proper supplemental light and stable room ventilation ensures vigorous photosynthesis and crisp foliage.';
const HYDRO_S2_SUB1_POOL = [
  'Modern full-spectrum LED fixtures replicate natural sunlight efficiently without emitting excessive heat that could scorch delicate leaves. Look for LED panels that combine blue wavelengths for leafy vegetative growth with balanced red wavelengths for sturdy stem development. Running your grow lights on an inexpensive digital timer for fourteen to sixteen hours each day gives plants the consistent energy they need to thrive.',
  'Maintain an optimal distance of eight to twelve inches between LED light bars and uppermost leaf canopies to avoid photobleaching.',
  'High-efficiency diodes convert electricity into usable photons with minimal thermal waste, keeping ambient grow room temperatures comfortable.',
  'Program dawn-to-dusk timer sequences to mimic natural circadian photoperiods that stimulate steady cellular development.',
  'Adjust photoperiod timers seasonally to synchronize artificial lighting schedules with household utility off-peak electricity hours.',
  'Wipe dust from LED heat sinks monthly to maintain optimal passive thermal dissipation and prolong diode lifespan.'
];
const HYDRO_S2_SUB2_POOL = [
  'Stagnant, humid indoor air invites mold and fungal spores. Position a small oscillating fan near your growing system to maintain gentle air circulation across the foliage. Aim to keep indoor temperatures between twenty and twenty-five degrees Celsius, which promotes optimal transpiration and nutrient uptake.',
  'Gentle breeze from an oscillating fan strengthens plant stem vascular walls, preventing floppy, weak vegetative structures.',
  'Maintain relative indoor humidity between fifty and sixty-five percent to facilitate smooth stomatal gas exchange without encouraging powdery mildew.',
  'Ventilate compact growing tents or closets daily to replenish fresh ambient carbon dioxide absorbed by rapid vegetative growth.',
  'Install a small carbon filter on exhaust ducting if cultivating strongly aromatic culinary herb varieties in enclosed apartment spaces.',
  'Position intake vents near floor level to draw cooler, denser ambient air upward across plant root canopies.'
];

const HYDRO_S3_INTRO = 'Because hydroponic plants do not have soil to act as a nutritional buffer, you must supply every essential mineral directly through the water reservoir.';
const HYDRO_S3_SUB1_POOL = [
  'Hydroponic fertilizers come as concentrated liquid or dry mineral salts formulated specifically for soil-less growing. These blends supply nitrogen, phosphorus, and potassium, alongside secondary minerals like calcium and magnesium. Always follow the manufacturer mixing instructions carefully, and never use conventional outdoor garden fertilizers, which lack crucial trace elements and can foul water pumps.',
  'Maintain electrical conductivity readings between one and two millisiemens per centimeter for tender culinary salad crops.',
  'Top off reservoirs with pure fresh water mid-week to offset natural leaf transpiration without concentrating mineral salt residues.',
  'Incorporate chelated iron additives if leaf veination shows signs of chlorosis or interveinal yellowing.',
  'Never mix concentrated nutrient stock solutions together directly in dry form; always dissolve each component completely in water sequentially.',
  'Track electrical conductivity changes over weekly intervals to determine whether plants are consuming water or dissolved minerals faster.'
];
const HYDRO_S3_SUB2_POOL = [
  'Water pH controls how readily plant roots absorb dissolved minerals. In hydroponics, the target pH range is between 5.5 and 6.5. If the solution becomes too acidic or too alkaline, plants experience nutrient lockout and display yellowing foliage even when nutrients are present. Check your reservoir every few days using an inexpensive digital pH pen or indicator drops, adjusting with small amounts of dilute pH-Up or pH-Down solution as needed.',
  'Record pH readings in a quick notebook log to track how quickly roots alter reservoir acidity over weekly growth spurts.',
  'Always dilute concentrated acid or alkaline adjustment drops in a cup of water before stirring them into the main reservoir tank.',
  'Calibrate your digital pH probe monthly with standard buffer solutions to ensure accurate, trustworthy readings.',
  'Store pH testing probes in designated potassium chloride storage solution to prevent glass electrode membrane dehydration.',
  'Perform minor pH adjustments gradually over several hours rather than shocking delicate root systems with rapid chemical swings.'
];
const HYDRO_S3_LIST_ITEMS = [
  '- Check water reservoir levels daily and top off with clean water.',
  '- Inspect leaf undersides weekly for signs of common pests like aphids.',
  '- Test pH twice per week to keep readings within the optimal range.',
  '- Rinse aeration stones monthly to maintain strong oxygen bubble delivery.',
  '- Drain and refresh full reservoir water every three weeks to eliminate accumulated mineral salts.'
];

const HYDRO_S4_POOL = [
  'Embarking on indoor hydroponic gardening gives you total control over the freshness and quality of the food on your table. By choosing a straightforward Deep Water Culture reservoir or compact vertical tower, pairing it with full-spectrum LED lights, and maintaining clean nutrient water, you can cultivate vibrant greens all year long. Pick your favorite herb or leafy salad green today, set up your reservoir, and enjoy the satisfaction of growing fresh produce right at home.',
  'With routine monitoring and clean system hygiene, soil-less cultivation becomes a reliable, rewarding weekly pleasure. Start small with a single reservoir, expand your crop variety progressively, and harvest nutrient-dense greens directly in your own kitchen.',
  'Cultivating crisp greens without soil connects urban households to the biological joy of plant growth while ensuring reliable kitchen harvests.',
  'With basic equipment and consistent weekly water monitoring, your indoor garden will supply crisp, delicious greens through every season.',
  'Take your first step into home hydroponics today and experience the satisfaction of harvesting fresh food directly from your living room.'
];

// -----------------------------------------------------------------------------
// Database Topic Pool
// -----------------------------------------------------------------------------
const DB_INTRO_POOL = [
  'Maintaining high database performance is critical for any engineering team operating cloud applications at scale. When user concurrency grows, inefficient SQL queries and unoptimized storage architectures quickly turn into painful latency bottlenecks that degrade user experience.',
  'Optimizing database performance does not require immediate, costly infrastructure upgrades. By methodically diagnosing slow query patterns, designing targeted indexes, and adding caching layers, you can dramatically improve response times and maximize throughput on your existing cloud hardware.',
  'A proactive approach to query observability and relational schema design unlocks exponential speedups without destabilizing production deployments. Systematic profiling reveals hidden sequential scans and lock contention before customers report application degradation.',
  'Modern cloud applications demand sustained sub-second execution across p95 and p99 latency distributions, making database performance tuning an indispensable core discipline.',
  'Proactive database performance engineering preserves responsive service level agreements, allowing businesses to scale digital products smoothly under fluctuating transaction loads.'
];

const DB_S1_INTRO = 'Effective performance tuning begins with accurate measurement rather than guesswork. Identifying which queries consume the most CPU and disk input-output allows you to focus your efforts where they make the largest impact.';
const DB_S1_SUB1_POOL = [
  'Enable slow query logging in your database management system to record statements exceeding a defined execution threshold. Once you identify high-latency queries, inspect them using execution plan commands such as EXPLAIN ANALYZE. The execution plan details the exact path the query optimizer took, highlighting high-cost sequential table scans and sorting operations that indicate missing indexes.',
  'Look closely at execution node buffers in query execution trees to see whether data is served from memory cache or dragged from physical disk.',
  'Filter slow query logs by total execution time rather than mean latency alone, highlighting lightweight queries executed millions of times daily.',
  'Inspect lock waiting times during transaction serialization to eliminate deadlock scenarios under intense write concurrency.',
  'Configure statement timeout thresholds to prevent runaway unindexed analytical queries from monopolizing shared server resources.',
  'Correlate database transaction execution spikes with application server telemetry to pinpoint inefficient ORM data loading loops.'
];
const DB_S1_SUB2_POOL = [
  'A sequential scan reads every single row in a table from disk into memory to evaluate filter conditions. While sequential scans are acceptable on tiny tables, they devastate performance on tables containing millions of rows. In contrast, an index scan traverses a compact balanced tree structure, allowing the engine to pinpoint matching records in milliseconds.',
  'Bitmap index scans provide an effective hybrid mechanism, combining multiple index lookups into an in-memory page bitmap before fetching physical heap rows.',
  'Index-only scans eliminate table heap lookups entirely when all selected columns are stored directly inside the index leaf nodes.',
  'Always verify table visibility maps with routine autovacuum maintenance to preserve index-only scan qualification across high-update tables.',
  'Evaluate hash join versus nested loop costs in query plans to verify the database optimizer selects optimal join strategies for varying table cardinalities.',
  'Use clustered indexes to physically order table rows on disk when primary access patterns consistently request contiguous range scans.'
];

const DB_S2_INTRO = 'Indexes are among the most powerful tools for accelerating query execution, but they must be deployed thoughtfully to avoid unintended side effects.';
const DB_S2_SUB1_POOL = [
  'When queries filter by multiple columns in a WHERE clause or join across foreign keys, single-column indexes are often inadequate. Designing composite B-tree indexes that match the exact column order of your frequent query filters allows the database engine to satisfy queries with minimal row lookups. Place high-cardinality equality columns first in composite index definitions to maximize selectivity.',
  'Leverage partial indexes with WHERE clauses to index only active or unarchived rows, reducing index storage footprints dramatically.',
  'Use covering indexes with INCLUDE clauses to attach non-key payload columns without bloating the tree sorting hierarchy.',
  'Evaluate expression indexes for queries filtering against transformed values, such as lowercased email addresses or truncated date timestamps.',
  'Consider partial GiST or GIN indexes when indexing specialized data types such as full-text documents, geographic coordinates, or JSONB payloads.',
  'Review index fill factor settings on write-intensive tables to reserve page space for non-HOT updates, preventing immediate page split overhead.'
];
const DB_S2_SUB2_POOL = [
  'Every index created on a table introduces computational overhead during INSERT, UPDATE, and DELETE operations. The database engine must synchronously update every associated index structure whenever data changes. Query your database system catalogs to identify unused indexes and safely remove them to restore write throughput and reclaim valuable storage space.',
  'Inspect index usage statistics catalogs like pg_stat_user_indexes regularly to pinpoint indexes with zero lifetime index scans.',
  'De-duplicate overlapping indexes where a composite index on columns A and B renders a single-column index on column A completely redundant.',
  'Rebuild fragmented indexes periodically on tables experiencing heavy churn to compact tree nodes and restore sequential read performance.',
  'Monitor index bloat percentages after bulk data deletion operations and execute concurrent index rebuilds to compact disk storage.',
  'Audit query plans after major application releases to verify schema modifications did not inadvertently invalidate established index paths.'
];
const DB_S2_LIST_ITEMS = [
  '- Profile execution plans with EXPLAIN ANALYZE before adding new indexes.',
  '- Eliminate redundant single-column indexes covered by existing composite indexes.',
  '- Monitor write latency overhead as index counts grow on high-throughput tables.',
  '- Use partial indexes on large tables to isolate frequently accessed row subsets.',
  '- Schedule regular autovacuum sweeps to prevent table bloat and index degradation.'
];

const DB_S3_INTRO = 'High-traffic applications frequently exhaust database resources through connection spikes and repetitive read requests that can be handled more efficiently outside the primary database engine.';
const DB_S3_SUB1_POOL = [
  'Opening a new database connection consumes significant server memory and requires an expensive transport layer handshake. Utilizing a lightweight connection pooler like PgBouncer allows hundreds of application instances to share a modest pool of persistent database connections, preventing connection exhaustion during traffic surges.',
  'Configure transaction-level pooling mode to recycle server connections immediately as soon as a single transaction block concludes.',
  'Tune connection pool limits to align with available CPU core capacity, avoiding thread context switching overhead under heavy load.',
  'Monitor client connection wait queues in pooling dashboards to ensure requests acquire server sessions without queuing delays.',
  'Set idle transaction timeouts on pooled client connections to release hung server sessions and avoid locking table resources.',
  'Deploy separate connection pools for latency-sensitive transactional queries and heavy background reporting jobs to avoid resource starvation.'
];
const DB_S3_SUB2_POOL = [
  'Repetitive read operations on frequently accessed data place unnecessary load on your primary storage engine. By introducing an in-memory key-value store such as Redis, you can serve high-frequency read queries in sub-millisecond timeframes. Cache common catalog items, user session profiles, and configuration settings, invalidating entries gracefully when underlying data changes.',
  'Implement cache-aside patterns with appropriate time-to-live expirations to prevent stale data accumulation.',
  'Apply probabilistic early expiration algorithms to avoid thundering herd cache stampedes when hot keys expire under heavy traffic.',
  'Compress cached JSON serialization payloads before storing them in Redis to optimize network transmission and RAM utilization.',
  'Use write-through or write-behind cache patterns strategically depending on whether application workloads tolerate eventual consistency.',
  'Monitor cache hit ratios continuously; a hit ratio dropping below ninety percent signals cache key thrashing or insufficient memory allocation.'
];

const DB_S4_POOL = [
  'Achieving fast, reliable database performance is an ongoing operational practice rather than a one-time project. By continuously inspecting slow query execution plans, refining your index strategy, and protecting database connections with pooling and caching, you build a resilient data tier that scales smoothly. Select your slowest endpoint today, analyze its query plan, and take the first step toward lasting performance improvements.',
  'Systematic database performance engineering ensures cloud applications deliver snappy user experiences even as transaction volumes multiply. Prioritize high-impact query plans, eliminate redundant storage reads, and maintain proactive alerts across your production infrastructure.',
  'Continuous latency profiling transforms database tuning from stressful reactive fire drills into disciplined, data-driven engineering practices.',
  'By combining targeted indexing, connection pooling, and in-memory caching, backend architectures maintain predictable sub-second response times under peak demand.',
  'Take the first step toward robust performance today: inspect your database slow query log and eliminate your single most expensive table scan.'
];

// -----------------------------------------------------------------------------
// Battery Topic Pool
// -----------------------------------------------------------------------------
const BATTERY_INTRO_POOL = [
  'Solid state battery technology represents one of the most promising frontiers in electric vehicle engineering and energy storage. By replacing conventional volatile liquid electrolytes with solid ceramic or polymer separators, solid state cells promise unprecedented improvements in energy density, fire safety, and rapid charging speeds.',
  'Commercializing solid state battery chemistry requires solving fundamental materials science and manufacturing challenges. Automotive engineers and battery manufacturers worldwide are investing heavily to transition these high-performance cells from research laboratories into mass-market electric vehicles.',
  'The shift toward solid electrolytes eliminates thermal runaway hazards associated with flammable organic solvents, allowing engineers to design lighter, more compact battery pack enclosures without heavy liquid cooling infrastructure.',
  'Achieving stable solid-solid interfaces under high charge cycling rates remains the central engineering hurdle for next-generation vehicle commercialization.',
  'Innovations in solid state battery research represent the critical technological bridge required for deep decarbonization of global road transportation networks.'
];

const BATTERY_S1_INTRO = 'Understanding the fundamental electrochemical mechanics of solid state cells reveals why they offer such dramatic performance advantages over legacy lithium-ion chemistries.';
const BATTERY_S1_SUB1_POOL = [
  'In conventional lithium-ion batteries, liquid organic electrolytes facilitate lithium ion transport between cathode and anode. In solid state designs, dense ceramic or polymer electrolytes conduct ions directly through a solid crystal lattice. This solid barrier physically prevents dendrite penetration, allowing the safe utilization of pure lithium metal anodes with significantly higher specific capacity.',
  'Ceramic oxide electrolytes provide exceptional ionic conductivity at room temperatures while remaining mechanically rigid against internal pressure changes.',
  'Polymer-based electrolytes offer superior flexibility and roll-to-roll processing compatibility, though they often require elevated operational temperatures to maximize ionic mobility.',
  'Composite solid electrolytes combine ceramic particles within polymer matrices to achieve balanced mechanical toughness and high ionic conductivity.',
  'Sulfide-based solid electrolytes offer remarkably high room-temperature ionic conductivity, though they require moisture-free dry-room handling to prevent toxic gas generation.',
  'Halide solid electrolytes emerge as a promising chemical class combining wide electrochemical stability windows with excellent oxidation resistance at high voltages.'
];
const BATTERY_S1_SUB2_POOL = [
  'Lithium metal anodes feature a theoretical specific capacity of 3860 milliamp-hours per gram, nearly ten times higher than conventional graphite anodes. Integrating pure lithium metal with solid state separators allows automotive battery packs to achieve volumetric energy densities exceeding one thousand watt-hours per liter.',
  'Higher volumetric density enables passenger electric vehicles to travel over seven hundred miles on a single charge without expanding vehicle physical footprints.',
  'Eliminating bulky graphite host structures reduces dead weight in vehicle chassis, improving overall powertrain acceleration and efficiency.',
  'Careful pressure regulation during battery assembly ensures intimate physical contact between the lithium metal layer and solid electrolyte separator.',
  'Anode-free cell architectures deposit lithium metal in-situ during initial charging, simplifying factory manufacturing while maximizing volumetric energy storage.',
  'Three-dimensional porous current collector scaffolds prevent localized current hot spots, promoting smooth, planar lithium plating during repetitive cycles.'
];

const BATTERY_S2_INTRO = 'Thermal safety and charging kinetics dictate whether electric vehicle battery architectures can achieve widespread consumer adoption.';
const BATTERY_S2_SUB1_POOL = [
  'Conventional lithium-ion battery fires originate from volatile liquid solvents catching fire during internal short circuits or mechanical punctures. Solid state batteries eliminate flammable solvents entirely, removing the fuel source for thermal runaway and dramatically improving vehicle crash safety standards across extreme temperature ranges.',
  'Solid ceramic separators withstand temperatures exceeding several hundred degrees Celsius without melting or decomposing.',
  'Enhanced inherent safety reduces the need for redundant thermal insulation and complex fire-suppression barriers within module packs.',
  'Vehicles operating solid state packs maintain predictable electrochemical safety profiles even under extreme ambient summer desert heat.',
  'Solid electrolytes physically suppress oxygen release from high-nickel cathode materials during elevated thermal excursions, neutralizing internal combustion risks.',
  'Advanced acoustic and impedance diagnostics monitor internal cell mechanical pressure continuously, detecting microscopic delamination before electrical failure occurs.'
];
const BATTERY_S2_SUB2_POOL = [
  'Fast charging in legacy cells risks metallic lithium plating and dendritic shorts that pierce thin plastic separators. Solid state battery electrolytes resist dendritic piercing, enabling higher current densities and ten-minute fast charging cycles without degrading cell cycle life.',
  'Optimized interfacial coatings minimize charge-transfer resistance, preventing localized heating during high-rate supercharging sessions.',
  'Advanced thermal management systems maintain uniform pack temperatures, ensuring every cell charges at equal velocity.',
  'Sustained high-current charging brings electric vehicle replenishment times closer to conventional liquid fuel refueling stops.',
  'Pulsed-current fast-charging algorithms distribute electric field gradients evenly across solid interfaces, minimizing mechanical stress during rapid replenishment.',
  'Integrating solid state cells into structural vehicle chassis designs lowers total vehicular curb weight, improving energy consumption watt-hours per mile.'
];
const BATTERY_S2_LIST_ITEMS = [
  '- Solid ceramic electrolytes eliminate flammable organic solvent risks.',
  '- Pure lithium metal anodes expand energy density toward 1000 Wh/L.',
  '- Non-volatile separators prevent catastrophic thermal runaway.',
  '- Sub-fifteen minute fast charging becomes achievable without dendrite penetration.',
  '- Simplified cooling architectures reduce vehicle weight and system complexity.'
];

const BATTERY_S3_INTRO = 'Transitioning from laboratory prototypes to gigawatt-hour factory production presents formidable materials and tooling roadblocks.';
const BATTERY_S3_SUB1_POOL = [
  'Solid-solid interfaces suffer from contact resistance because microscopic surface roughness prevents uniform ion exchange. Under continuous charge and discharge cycles, lithium metal expands and contracts, creating interfacial voids that choke ion conductivity unless uniform mechanical pressure is continuously applied across the cell.',
  'Deploying micro-spring tensioners or elastic compression pads within module enclosures maintains necessary interfacial pressure throughout pack lifetime.',
  'Atomic layer deposition techniques apply nanometer-thin buffer layers that smooth microscopic surface voids and lower interfacial impedance.',
  'Engineers continuously monitor impedance rise over thousands of operational cycles to evaluate long-term interface durability.',
  'Flexible polymer interlayer buffers accommodate volumetric changes during lithium stripping and plating, preventing catastrophic interfacial void formation.',
  'High-throughput robotic testing stations evaluate interfacial impedance under varied temperature and mechanical pressure regimes to qualify automotive cells.'
];
const BATTERY_S3_SUB2_POOL = [
  'Existing gigafactories are designed for wet slurry coating and liquid electrolyte injection. Solid state cell manufacturing requires specialized dry-room environments, vacuum sintering, and precision calender rolling lines that demand substantial capital investment and new process validation protocols.',
  'Scaling continuous roll-to-roll production lines requires ultra-thin, defect-free ceramic ribbons that resist brittle cracking under tension.',
  'Supply chains for high-purity precursor materials must expand globally to support multi-gigawatt annual manufacturing volumes.',
  'Automated optical inspection systems inspect every square meter of solid electrolyte film for microscopic pinholes and micro-cracks.',
  'Precision laser cutting and high-speed robotic cell stacking systems ensure continuous defect-free assembly at automotive production speeds.',
  'Standardized battery module enclosures must incorporate uniform mechanical compression springs that sustain optimal pressure across millions of operational vehicle miles.'
];

const BATTERY_S4_POOL = [
  'The horizon for solid state battery commercialization is accelerating rapidly through dedicated automotive partnerships and intense engineering investment. While high manufacturing costs and interfacial impedance currently limit widespread production, early pilot vehicle fleets are slated for deployment before the end of the decade. As roll-to-roll manufacturing matures and material yields improve, solid state batteries will redefine electric mobility with unprecedented range, safety, and charging convenience.',
  'Automotive manufacturers who master solid state battery integration will set new industry benchmarks for performance and reliability across the global clean energy transition.',
  'The transition from exploratory laboratory prototyping to pilot manufacturing marks a decisive turning point in electric transportation history.',
  'With continued engineering dedication and capital investment, solid state batteries will establish transformative standards for driving range, charging speed, and fire safety.',
  'Embrace the next era of electrochemical innovation and follow the unfolding revolution in next-generation battery technology today.'
];

// -----------------------------------------------------------------------------
// Adaptive Outline Generator
// -----------------------------------------------------------------------------
export function generateAdaptiveOutline(params: {
  topic: string;
  primaryKeyword: string;
  audience: string;
  targetWords: number;
}): AdaptiveOutline {
  const { topic, primaryKeyword, targetWords } = params;
  const domain = detectTopicDomain(topic, primaryKeyword);

  const total = Math.max(300, Math.min(2000, targetWords));
  const introWords = Math.round(total * 0.1);
  const bodyWords = total - introWords;

  // Split bodyWords across 4 sections (approximately 28%, 25%, 25%, 22%)
  const w1 = Math.round(bodyWords * 0.28);
  const w2 = Math.round(bodyWords * 0.25);
  const w3 = Math.round(bodyWords * 0.25);
  const w4 = bodyWords - (w1 + w2 + w3);

  if (domain === 'herb') {
    return {
      intro: 'Hook the reader with culinary aroma, state the primary keyword in the opening paragraphs, and outline the setup roadmap.',
      sections: [
        {
          h2: 'Choosing the Best Spot for Your Indoor Herb Garden',
          h3: ['Windowsill sunlight guidelines', 'Supplementing with compact grow lights'],
          purpose: 'Help beginners locate the ideal sunny zone in their kitchen.',
          targetWords: w1
        },
        {
          h2: 'Selecting Pots, Soil, and Drainage Essentials',
          h3: ['Pot diameter and saucer drainage', 'Potting mix aeration'],
          purpose: 'Provide concrete advice on container and soil choices.',
          targetWords: w2
        },
        {
          h2: 'Indoor Herb Garden Watering and Daily Care',
          h3: ['The soil moisture finger test', 'Pruning rules for bushier herbs'],
          purpose: 'Explain simple watering routines and harvesting hygiene.',
          targetWords: w3
        },
        {
          h2: 'Conclusion: Start Your Indoor Herb Garden Today',
          h3: [],
          purpose: 'Summarise main takeaways and give one clear next step.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'hydroponic') {
    return {
      intro: 'Hook urban homeowners with the ease of soil-less growing, introduce indoor hydroponic gardening, and preview system setup steps.',
      sections: [
        {
          h2: 'Choosing the Right Hydroponic System for Small Spaces',
          h3: ['Deep water culture vs nutrient film technique', 'Compact vertical towers for apartment balconies'],
          purpose: 'Help urban beginners select a compact, leak-proof system suitable for indoor apartments.',
          targetWords: w1
        },
        {
          h2: 'Lighting and Environmental Controls for Indoor Greens',
          h3: ['Selecting full-spectrum LED grow lights', 'Managing room airflow and temperature'],
          purpose: 'Guide growers in providing adequate light without excessive heat buildup.',
          targetWords: w2
        },
        {
          h2: 'Nutrient Solutions and pH Monitoring Essentials',
          h3: ['Mixing macro and micronutrient concentrates', 'Maintaining balanced water pH between 5.5 and 6.5'],
          purpose: 'Explain how to deliver balanced plant nutrition and prevent nutrient lockout.',
          targetWords: w3
        },
        {
          h2: 'Conclusion: Start Your Indoor Hydroponic Gardening Journey',
          h3: [],
          purpose: 'Summarise core steps and provide a clear first step for beginners.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'database') {
    return {
      intro: 'Hook backend engineers with the impact of query latency, introduce database performance, and outline optimization pillars.',
      sections: [
        {
          h2: 'Identifying Query Bottlenecks and Execution Plans',
          h3: ['Analyzing slow query logs with explain analyze', 'Index scan versus sequential table scan'],
          purpose: 'Show developers how to locate expensive queries and diagnose execution costs.',
          targetWords: w1
        },
        {
          h2: 'Optimizing Indexes and Table Schemas for Speed',
          h3: ['Designing composite B-tree indexes', 'Pruning redundant and unused indexes'],
          purpose: 'Explain how targeted indexing reduces disk I/O without hurting write throughput.',
          targetWords: w2
        },
        {
          h2: 'Implementing Connection Pooling and In-Memory Caching',
          h3: ['Sizing connection pools with PgBouncer', 'Offloading read queries to Redis cache layers'],
          purpose: 'Describe how caching and connection reuse protect database CPU under heavy traffic.',
          targetWords: w3
        },
        {
          h2: 'Conclusion: Maintain Fast Database Performance',
          h3: [],
          purpose: 'Summarise the main takeaways and give one clear next action.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'battery') {
    return {
      intro: 'Introduce solid state battery technology and its role in transforming electric vehicle range, charging, and safety.',
      sections: [
        {
          h2: 'Understanding Solid State Battery Chemistry and Design',
          h3: ['Solid ceramic versus liquid electrolytes', 'Lithium metal anodes and energy density'],
          purpose: 'Explain the electrochemical differences that make solid state cells promising.',
          targetWords: w1
        },
        {
          h2: 'Thermal Safety and Fast Charging Capabilities',
          h3: ['Eliminating flammable liquid solvents', 'Managing dendritic growth during high-rate charging'],
          purpose: 'Cover safety improvements and charging advantages over conventional lithium-ion packs.',
          targetWords: w2
        },
        {
          h2: 'Manufacturing Challenges and Cost Roadblocks',
          h3: ['Solid-electrolyte interface resistance', 'Scaling roll-to-roll production lines'],
          purpose: 'Discuss real-world commercialization hurdles without hype.',
          targetWords: w3
        },
        {
          h2: 'Conclusion: The Horizon for Solid State Battery Commercialization',
          h3: [],
          purpose: 'Summarise the timeline and market outlook for solid state battery adoption.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'cinema_ai') {
    return {
      intro: `Hook the reader with how artificial intelligence is transforming cinema, introduce ${primaryKeyword} in the opening, and preview the production roadmap.`,
      sections: [
        {
          h2: `The Transformative Rise of ${primaryKeyword}`,
          h3: ['Algorithmic script analysis and generative pre-visualization', 'Revolutionizing digital visual effects and synthetic environments'],
          purpose: 'Explain how machine learning and generative tools accelerate early creative development.',
          targetWords: w1
        },
        {
          h2: 'Production Efficiency and Creative Augmentation Across Studios',
          h3: ['Streamlining post-production editing, color grading, and dubbing', 'Virtual production stages and real-time machine learning rendering'],
          purpose: 'Describe how automated workflows and LED soundstages optimize studio execution.',
          targetWords: w2
        },
        {
          h2: 'Ethical Considerations, Creative Rights, and the Labor Landscape',
          h3: ['Protecting actor likenesses, voice rights, and creative copyright', 'Balancing technological innovation with human artistic vision'],
          purpose: 'Address legal safeguards, performer consent, and artistic integrity in modern cinema.',
          targetWords: w3
        },
        {
          h2: `Conclusion: The Collaborative Future of ${primaryKeyword}`,
          h3: [],
          purpose: 'Summarise key takeaways and provide one actionable next step for filmmakers.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'cinema_lgbtq') {
    return {
      intro: `Hook the reader with the cultural evolution of queer cinema, introduce ${primaryKeyword} in the opening, and preview the historical and contemporary roadmap.`,
      sections: [
        {
          h2: `The Evolution of ${primaryKeyword}`,
          h3: ['Breaking historical barriers and early independent milestones', 'Complex character arcs beyond tragic tropes and stereotypes'],
          purpose: 'Trace the progression of queer cinema from underground resistance to artistic nuance.',
          targetWords: w1
        },
        {
          h2: 'Cultural Impact and Mainstream Cinematic Recognition',
          h3: ['Authentic casting and intersectional queer storytelling', 'Global reception, box office success, and festival acclaim'],
          purpose: 'Examine how diverse casting and awards recognition elevated queer stories worldwide.',
          targetWords: w2
        },
        {
          h2: 'Ongoing Challenges and the Future of Inclusive Filmmaking',
          h3: ['Navigating international distribution and censorship hurdles', 'Empowering diverse creators behind and in front of the camera'],
          purpose: 'Address commercial distribution obstacles and the need for behind-the-scenes inclusion.',
          targetWords: w3
        },
        {
          h2: `Conclusion: Championing Authentic ${primaryKeyword}`,
          h3: [],
          purpose: 'Summarise main insights and encourage audiences and studios to champion diverse cinema.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'education_ai') {
    return {
      intro: `Hook the reader with the impact of modern educational technology, introduce ${primaryKeyword} in the opening, and preview the classroom transformation roadmap.`,
      sections: [
        {
          h2: `How ${primaryKeyword} Is Reshaping Modern Classrooms`,
          h3: ['Personalized learning pathways and adaptive tutoring platforms', 'Automating administrative workflows to empower instructional time'],
          purpose: 'Explain how adaptive learning algorithms and automated grading empower educators.',
          targetWords: w1
        },
        {
          h2: 'Enhancing Student Engagement and Educational Accessibility',
          h3: ['Multimodal learning aids for diverse learning styles and abilities', 'Intelligent analytics for identifying early learning intervention needs'],
          purpose: 'Cover accessible multimodal tools and predictive analytics for early intervention.',
          targetWords: w2
        },
        {
          h2: 'Navigating Ethical Challenges, Data Privacy, and Digital Equity',
          h3: ['Protecting student data privacy and mitigating algorithmic bias', 'Bridging the digital divide to ensure universal educational access'],
          purpose: 'Discuss student data privacy, bias prevention, and bridging digital divide gaps.',
          targetWords: w3
        },
        {
          h2: `Conclusion: Fostering Human-Centered ${primaryKeyword}`,
          h3: [],
          purpose: 'Summarise key benefits and outline a clear first step for educators and administrators.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'cybersecurity') {
    return {
      intro: `Hook the reader with the necessity of digital protection, introduce ${primaryKeyword} in the opening, and preview the personal security roadmap.`,
      sections: [
        {
          h2: `Understanding ${primaryKeyword}`,
          h3: ['Recognizing common digital threat vectors and phishing schemes', 'The importance of multi-factor authentication and credential hygiene'],
          purpose: 'Teach readers how to recognize phishing threats and practice strong password hygiene.',
          targetWords: w1
        },
        {
          h2: 'Securing Personal Devices, Home Networks, and Digital Identities',
          h3: ['Hardening home Wi-Fi routers and connected smart IoT devices', 'Safe mobile computing, automatic software updates, and data backups'],
          purpose: 'Explain how to configure home routers, update devices, and maintain automated backups.',
          targetWords: w2
        },
        {
          h2: 'Data Privacy, Online Scams, and Proactive Threat Defense',
          h3: ['Safeguarding personal financial records and sensitive personal data', 'Developing resilient digital habits against modern social engineering'],
          purpose: 'Cover credit freezes, financial monitoring, and defenses against social engineering.',
          targetWords: w3
        },
        {
          h2: `Conclusion: Practicing Strong ${primaryKeyword}`,
          h3: [],
          purpose: 'Summarise core habits and offer one immediate security action to take today.',
          targetWords: w4
        }
      ]
    };
  }

  if (domain === 'climate_sustainability') {
    return {
      intro: `Hook the reader with practical ecological stewardship, introduce ${primaryKeyword} in the opening, and preview the household decarbonization roadmap.`,
      sections: [
        {
          h2: `Understanding Climate Change and ${primaryKeyword}`,
          h3: ['Assessing household ecological footprints and resource consumption', 'Energy conservation, renewable adoption, and home electrification'],
          purpose: 'Help readers calculate ecological footprints and adopt clean residential energy.',
          targetWords: w1
        },
        {
          h2: 'Practical Daily Habits for Reducing Environmental Impact',
          h3: ['Adopting zero-waste food practices and responsible consumption', 'Sustainable mobility, active transit, and mindful travel choices'],
          purpose: 'Provide concrete daily habits for reducing waste, food emissions, and transit impact.',
          targetWords: w2
        },
        {
          h2: 'Community Engagement, Policy Support, and Systemic Climate Action',
          h3: ['Amplifying grassroots environmental initiatives and circular economies', 'Supporting climate resilience policies and sustainable consumer choices'],
          purpose: 'Show how collective neighborhood initiatives and civic advocacy accelerate systemic change.',
          targetWords: w3
        },
        {
          h2: `Conclusion: Embracing ${primaryKeyword} for a Resilient Future`,
          h3: [],
          purpose: 'Summarise primary takeaways and give one actionable starting step for households.',
          targetWords: w4
        }
      ]
    };
  }

  // Universal dynamic outline for any other topic
  return {
    intro: `Hook the reader with the value of ${topic}, introduce ${primaryKeyword} in the opening, and preview the practical roadmap.`,
    sections: [
      {
        h2: `Understanding the Core Principles of ${primaryKeyword}`,
        h3: ['Essential terminology and conceptual framework', `Strategic priorities for ${params.audience}`],
        purpose: 'Explain foundational concepts clearly without confusing jargon.',
        targetWords: w1
      },
      {
        h2: 'Practical Methodologies and Implementation Frameworks',
        h3: ['Structured deployment workflows and best practices', 'Optimizing execution efficiency and continuous iteration'],
        purpose: 'Provide practical advice for setting up and executing properly from day one.',
        targetWords: w2
      },
      {
        h2: 'Overcoming Critical Challenges and Scaling for Success',
        h3: ['Diagnosing bottlenecks and common pitfalls', 'Measuring tangible outcomes and driving continuous improvement'],
        purpose: 'Explain troubleshooting routines and long-term optimization methods.',
        targetWords: w3
      },
      {
        h2: `Conclusion: Mastering ${primaryKeyword} for Long-Term Success`,
        h3: [],
        purpose: 'Summarise main takeaways and provide one actionable next step.',
        targetWords: w4
      }
    ]
  };
}

// -----------------------------------------------------------------------------
// Adaptive Article Generator
// -----------------------------------------------------------------------------
export function generateAdaptiveArticle(params: AdaptiveArticleParams): string {
  const { topic, primaryKeyword, audience, targetWords, expectedH1, outlineSections } = params;
  const domain = detectTopicDomain(topic, primaryKeyword);

  const target = Math.max(300, Math.min(2000, targetWords || 800));

  let h1 = expectedH1 || `# ${primaryKeyword}: Complete Step-by-Step Guide`;
  if (!h1.startsWith('# ')) h1 = `# ${h1}`;

  let introPool: string[];
  let s1Data: any;
  let s2Data: any;
  let s3Data: any;
  let s4Data: any;

  if (domain === 'herb') {
    introPool = HERB_INTRO_POOL;
    s1Data = {
      h2: '## Choosing the Best Spot for Your Indoor Herb Garden',
      intro: HERB_S1_INTRO,
      sub1H3: '### Windowsill sunlight guidelines',
      sub1Pool: HERB_S1_SUB1_POOL,
      sub2H3: '### Supplementing with compact grow lights',
      sub2Pool: HERB_S1_SUB2_POOL
    };
    s2Data = {
      h2: '## Selecting Pots, Soil, and Drainage Essentials',
      intro: HERB_S2_INTRO,
      sub1H3: '### Pot diameter and saucer drainage',
      sub1Pool: HERB_S2_SUB1_POOL,
      sub2H3: '### Potting mix aeration',
      sub2Pool: HERB_S2_SUB2_POOL,
      listItems: HERB_S2_LIST_ITEMS
    };
    s3Data = {
      h2: '## Indoor Herb Garden Watering and Daily Care',
      intro: HERB_S3_INTRO,
      sub1H3: '### The soil moisture finger test',
      sub1Pool: HERB_S3_SUB1_POOL,
      sub2H3: '### Pruning rules for bushier herbs',
      sub2Pool: HERB_S3_SUB2_POOL
    };
    s4Data = {
      h2: '## Conclusion: Start Your Indoor Herb Garden Today',
      pool: HERB_S4_POOL
    };
  } else if (domain === 'hydroponic') {
    introPool = HYDRO_INTRO_POOL;
    s1Data = {
      h2: '## Choosing the Right Hydroponic System for Small Spaces',
      intro: HYDRO_S1_INTRO,
      sub1H3: '### Deep water culture vs nutrient film technique',
      sub1Pool: HYDRO_S1_SUB1_POOL,
      sub2H3: '### Compact vertical towers for apartment balconies',
      sub2Pool: HYDRO_S1_SUB2_POOL
    };
    s2Data = {
      h2: '## Lighting and Environmental Controls for Indoor Greens',
      intro: HYDRO_S2_INTRO,
      sub1H3: '### Selecting full-spectrum LED grow lights',
      sub1Pool: HYDRO_S2_SUB1_POOL,
      sub2H3: '### Managing room airflow and temperature',
      sub2Pool: HYDRO_S2_SUB2_POOL
    };
    s3Data = {
      h2: '## Nutrient Solutions and pH Monitoring Essentials',
      intro: HYDRO_S3_INTRO,
      sub1H3: '### Mixing macro and micronutrient concentrates',
      sub1Pool: HYDRO_S3_SUB1_POOL,
      sub2H3: '### Maintaining balanced water pH between 5.5 and 6.5',
      sub2Pool: HYDRO_S3_SUB2_POOL,
      listItems: HYDRO_S3_LIST_ITEMS
    };
    s4Data = {
      h2: '## Conclusion: Start Your Indoor Hydroponic Gardening Journey',
      pool: HYDRO_S4_POOL
    };
  } else if (domain === 'database') {
    introPool = DB_INTRO_POOL;
    s1Data = {
      h2: '## Identifying Query Bottlenecks and Execution Plans',
      intro: DB_S1_INTRO,
      sub1H3: '### Analyzing slow query logs with explain analyze',
      sub1Pool: DB_S1_SUB1_POOL,
      sub2H3: '### Index scan versus sequential table scan',
      sub2Pool: DB_S1_SUB2_POOL
    };
    s2Data = {
      h2: '## Optimizing Indexes and Table Schemas for Speed',
      intro: DB_S2_INTRO,
      sub1H3: '### Designing composite B-tree indexes',
      sub1Pool: DB_S2_SUB1_POOL,
      sub2H3: '### Pruning redundant and unused indexes',
      sub2Pool: DB_S2_SUB2_POOL,
      listItems: DB_S2_LIST_ITEMS
    };
    s3Data = {
      h2: '## Implementing Connection Pooling and In-Memory Caching',
      intro: DB_S3_INTRO,
      sub1H3: '### Sizing connection pools with PgBouncer',
      sub1Pool: DB_S3_SUB1_POOL,
      sub2H3: '### Offloading read queries to Redis cache layers',
      sub2Pool: DB_S3_SUB2_POOL
    };
    s4Data = {
      h2: '## Conclusion: Maintain Fast Database Performance',
      pool: DB_S4_POOL
    };
  } else if (domain === 'battery') {
    introPool = BATTERY_INTRO_POOL;
    s1Data = {
      h2: '## Understanding Solid State Battery Chemistry and Design',
      intro: BATTERY_S1_INTRO,
      sub1H3: '### Solid ceramic versus liquid electrolytes',
      sub1Pool: BATTERY_S1_SUB1_POOL,
      sub2H3: '### Lithium metal anodes and energy density',
      sub2Pool: BATTERY_S1_SUB2_POOL
    };
    s2Data = {
      h2: '## Thermal Safety and Fast Charging Capabilities',
      intro: BATTERY_S2_INTRO,
      sub1H3: '### Eliminating flammable liquid solvents',
      sub1Pool: BATTERY_S2_SUB1_POOL,
      sub2H3: '### Managing dendritic growth during high-rate charging',
      sub2Pool: BATTERY_S2_SUB2_POOL,
      listItems: BATTERY_S2_LIST_ITEMS
    };
    s3Data = {
      h2: '## Manufacturing Challenges and Cost Roadblocks',
      intro: BATTERY_S3_INTRO,
      sub1H3: '### Solid-electrolyte interface resistance',
      sub1Pool: BATTERY_S3_SUB1_POOL,
      sub2H3: '### Scaling roll-to-roll production lines',
      sub2Pool: BATTERY_S3_SUB2_POOL
    };
    s4Data = {
      h2: '## Conclusion: The Horizon for Solid State Battery Commercialization',
      pool: BATTERY_S4_POOL
    };
  } else if (domain === 'cinema_ai') {
    introPool = CINEMA_AI_DATA.introPool;
    s1Data = { ...CINEMA_AI_DATA.s1 };
    s2Data = { ...CINEMA_AI_DATA.s2 };
    s3Data = { ...CINEMA_AI_DATA.s3 };
    s4Data = { ...CINEMA_AI_DATA.s4 };
  } else if (domain === 'cinema_lgbtq') {
    introPool = CINEMA_LGBTQ_DATA.introPool;
    s1Data = { ...CINEMA_LGBTQ_DATA.s1 };
    s2Data = { ...CINEMA_LGBTQ_DATA.s2 };
    s3Data = { ...CINEMA_LGBTQ_DATA.s3 };
    s4Data = { ...CINEMA_LGBTQ_DATA.s4 };
  } else if (domain === 'education_ai') {
    introPool = EDUCATION_AI_DATA.introPool;
    s1Data = { ...EDUCATION_AI_DATA.s1 };
    s2Data = { ...EDUCATION_AI_DATA.s2 };
    s3Data = { ...EDUCATION_AI_DATA.s3 };
    s4Data = { ...EDUCATION_AI_DATA.s4 };
  } else if (domain === 'cybersecurity') {
    introPool = CYBERSECURITY_DATA.introPool;
    s1Data = { ...CYBERSECURITY_DATA.s1 };
    s2Data = { ...CYBERSECURITY_DATA.s2 };
    s3Data = { ...CYBERSECURITY_DATA.s3 };
    s4Data = { ...CYBERSECURITY_DATA.s4 };
  } else if (domain === 'climate_sustainability') {
    introPool = CLIMATE_SUSTAINABILITY_DATA.introPool;
    s1Data = { ...CLIMATE_SUSTAINABILITY_DATA.s1 };
    s2Data = { ...CLIMATE_SUSTAINABILITY_DATA.s2 };
    s3Data = { ...CLIMATE_SUSTAINABILITY_DATA.s3 };
    s4Data = { ...CLIMATE_SUSTAINABILITY_DATA.s4 };
  } else {
    const universal = buildUniversalTopicPools(topic, primaryKeyword, audience);
    introPool = universal.introPool;
    s1Data = { ...universal.s1 };
    s2Data = { ...universal.s2 };
    s3Data = { ...universal.s3 };
    s4Data = { ...universal.s4 };
  }

  // If outlineSections are provided in params, override H2 and H3 headings to guarantee 100% outline fidelity
  if (outlineSections && outlineSections.length >= 4) {
    s1Data.h2 = outlineSections[0].h2;
    if (outlineSections[0].h3?.[0]) s1Data.sub1H3 = outlineSections[0].h3[0];
    if (outlineSections[0].h3?.[1]) s1Data.sub2H3 = outlineSections[0].h3[1];

    s2Data.h2 = outlineSections[1].h2;
    if (outlineSections[1].h3?.[0]) s2Data.sub1H3 = outlineSections[1].h3[0];
    if (outlineSections[1].h3?.[1]) s2Data.sub2H3 = outlineSections[1].h3[1];

    s3Data.h2 = outlineSections[2].h2;
    if (outlineSections[2].h3?.[0]) s3Data.sub1H3 = outlineSections[2].h3[0];
    if (outlineSections[2].h3?.[1]) s3Data.sub2H3 = outlineSections[2].h3[1];

    s4Data.h2 = outlineSections[outlineSections.length - 1].h2;
  }

  // Calculate word distribution budgets
  const introBudget = Math.round(target * 0.10);
  const outroBudget = Math.round(target * 0.08);
  const remaining = target - introBudget - outroBudget;
  const sectionBudget = Math.round(remaining / 3);

  function assembleSection(sec: any, budget: number): string[] {
    const h2Line = sec.h2.startsWith('## ') ? sec.h2 : `## ${sec.h2}`;
    const sub1H3 = sec.sub1H3.startsWith('### ') ? sec.sub1H3 : `### ${sec.sub1H3}`;
    const sub2H3 = sec.sub2H3.startsWith('### ') ? sec.sub2H3 : `### ${sec.sub2H3}`;

    const parts: string[] = [h2Line];

    // For smaller targets (< 650), omit section intro to keep word count tight
    if (sec.intro && target >= 650) {
      parts.push(sec.intro);
    }

    parts.push(sub1H3);
    const sub1Items: string[] = [];
    const sub2Items: string[] = [];

    // Base items
    if (sec.sub1Pool?.length > 0) sub1Items.push(sec.sub1Pool[0]);
    if (sec.sub2Pool?.length > 0) sub2Items.push(sec.sub2Pool[0]);

    let baseListText = '';
    if (sec.listItems && sec.listItems.length > 0) {
      const listCount = budget < 160 ? 3 : 5;
      baseListText = sec.listItems.slice(0, listCount).join('\n');
    }

    let current = countWords([
      h2Line,
      (target >= 650 ? sec.intro : '') || '',
      sub1H3,
      sub1Items.join(' '),
      sub2H3,
      sub2Items.join(' '),
      baseListText
    ].join(' '));

    let idx1 = 1;
    let idx2 = 1;

    // For targets >= 650, expand sections with deeper paragraphs until section budget is reached
    if (target >= 650) {
      while (current < budget - 10) {
        let added = false;
        if (idx1 < sec.sub1Pool.length && current + countWords(sec.sub1Pool[idx1]) <= budget + 50) {
          sub1Items.push(sec.sub1Pool[idx1]);
          current += countWords(sec.sub1Pool[idx1]);
          idx1++;
          added = true;
        }
        if (idx2 < sec.sub2Pool.length && current + countWords(sec.sub2Pool[idx2]) <= budget + 50) {
          sub2Items.push(sec.sub2Pool[idx2]);
          current += countWords(sec.sub2Pool[idx2]);
          idx2++;
          added = true;
        }
        if (!added) break;
      }
    }

    parts.push(sub1Items.join('\n\n'));
    parts.push(sub2H3);
    parts.push(sub2Items.join('\n\n'));
    if (baseListText) parts.push(baseListText);

    return parts;
  }

  // Assemble intro
  const introParts: string[] = [];
  let introWords = 0;
  for (const p of introPool) {
    if (introParts.length === 0 || introWords + countWords(p) <= introBudget + 15) {
      introParts.push(p);
      introWords += countWords(p);
    } else {
      break;
    }
  }

  const s1Parts = assembleSection(s1Data, sectionBudget);
  const s2Parts = assembleSection(s2Data, sectionBudget);
  const s3Parts = assembleSection(s3Data, sectionBudget);

  // Assemble outro
  const outroH2 = s4Data.h2.startsWith('## ') ? s4Data.h2 : `## ${s4Data.h2}`;
  const outroParts: string[] = [outroH2];
  let outroWords = countWords(outroH2);
  for (const p of s4Data.pool) {
    if (outroParts.length === 1 || outroWords + countWords(p) <= outroBudget + 15) {
      outroParts.push(p);
      outroWords += countWords(p);
    } else {
      break;
    }
  }

  let article = [
    h1,
    '',
    introParts.join('\n\n'),
    '',
    s1Parts.join('\n\n'),
    '',
    s2Parts.join('\n\n'),
    '',
    s3Parts.join('\n\n'),
    '',
    outroParts.join('\n\n')
  ].join('\n');

  const minWords = Math.round(target * 0.90);
  const maxWords = Math.round(target * 1.10);

  // Trim if over target
  if (countWords(article) > maxWords) {
    article = calibrateArticleWordCount(article, target);
  }

  // Safeguard: if below minWords, append additional paragraphs from available pools before conclusion
  let currentWords = countWords(article);
  if (currentWords < minWords) {
    const backupParagraphs = [
      ...(s1Data.sub2Pool || []),
      ...(s2Data.sub2Pool || []),
      ...(s3Data.sub2Pool || []),
      ...(s1Data.sub1Pool || []),
      ...(s2Data.sub1Pool || []),
      ...(s3Data.sub1Pool || []),
      ...(introPool || []),
      ...(s4Data.pool || [])
    ];
    for (const p of backupParagraphs) {
      if (currentWords >= minWords) break;
      if (!article.includes(p)) {
        const outroH2Idx = article.lastIndexOf('\n## ');
        if (outroH2Idx !== -1) {
          article = article.slice(0, outroH2Idx) + `\n\n${p}\n` + article.slice(outroH2Idx);
          currentWords = countWords(article);
        }
      }
    }
  }

  return article;
}

// -----------------------------------------------------------------------------
// Controlled Correction & Trimming Helper for Live LLM Provider Output
// -----------------------------------------------------------------------------
export function calibrateArticleWordCount(markdown: string, targetWords: number): string {
  if (!markdown || !markdown.trim() || targetWords <= 0) return markdown;
  const current = countWords(markdown);

  // If already within 8% of target or under target, no trimming needed.
  // Under-target live generation is handled via prompt expansion retry.
  if (current <= targetWords * 1.08) {
    return markdown;
  }

  // Over target by > 8%: carefully trim trailing sentences across middle body sections.
  // Preserves:
  // 1. Top-level H1 and introductory section (before the first H2)
  // 2. All H2/H3 headings, lists, and code blocks
  // 3. Concluding H2 section (the final H2 block)
  // Trimming is distributed across eligible middle body paragraphs (cycling through paragraphs).
  const lines = markdown.split('\n');

  // Identify H2 heading lines
  const h2Indices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('## ')) {
      h2Indices.push(i);
    }
  }

  // Require at least 2 H2 sections to have an introductory middle and a concluding section
  if (h2Indices.length < 2) return markdown;

  const firstH2Idx = h2Indices[0];
  const lastH2Idx = h2Indices[h2Indices.length - 1]; // Conclusion starts here

  // Find eligible body paragraph indices between firstH2Idx and lastH2Idx
  const eligibleLineIndices: number[] = [];
  let inCode = false;
  for (let i = firstH2Idx + 1; i < lastH2Idx; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    // Do not touch headings, bullet/numbered lists, or very short lines
    if (
      trimmed.startsWith('#') ||
      trimmed.startsWith('-') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('+') ||
      /^\d+\./.test(trimmed)
    ) {
      continue;
    }

    if (trimmed.length > 60) {
      eligibleLineIndices.push(i);
    }
  }

  if (eligibleLineIndices.length === 0) return markdown;

  const modifiedLines = [...lines];
  let currentWords = current;
  const targetCeiling = Math.round(targetWords * 1.04);

  // Distributed round-robin trimming of non-essential trailing sentences across middle paragraphs
  let madeProgress = true;
  let pass = 0;
  while (currentWords > targetCeiling && madeProgress && pass < 6) {
    madeProgress = false;
    pass++;

    for (const lineIdx of eligibleLineIndices) {
      if (currentWords <= targetCeiling) break;

      const paragraphText = modifiedLines[lineIdx];
      // Split into sentences preserving punctuation
      const sentences = paragraphText.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
      // Keep at least 2 sentences per paragraph so paragraphs stay substantive
      if (sentences && sentences.length > 2) {
        const removedSentence = sentences.pop();
        const updatedParagraph = sentences.map((s) => s.trim()).join(' ');
        const wordsRemoved = countWords(paragraphText) - countWords(updatedParagraph);

        if (wordsRemoved > 0) {
          modifiedLines[lineIdx] = updatedParagraph;
          currentWords -= wordsRemoved;
          madeProgress = true;
        }
      }
    }
  }

  return modifiedLines.join('\n');
}

/**
 * Seed real Dhani Travels data into the database.
 * Run: node seed-real-data.js
 */

const API = "http://localhost:4000/api";
const ADMIN_KEY = "dhani-travels";

async function adminRequest(path, method = "GET", body = null) {
    const opts = {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY
        }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API}/admin${path}`, opts);
    const json = await res.json();
    if (!res.ok) throw new Error(`${method} ${path} → ${json.error}`);
    return json;
}

async function main() {
    console.log("🌱 Seeding Dhani Travels data...\n");

    // ── 1. Update Agency Settings ──
    console.log("📋 Updating agency settings...");
    await adminRequest("/settings", "PUT", {
        agency_name: "Dhani Travels",
        contact_phone: "+91 9759896015",
        whatsapp_number: "919759896015",
        support_email: "info@dhanitravels.com",
        address: "Uttarakhand, India",
        instagram_url: "",
        facebook_url: "",
        twitter_url: "",
        youtube_url: ""
    });
    console.log("  ✅ Agency settings updated\n");

    // ── 2. Create Destinations ──
    const destinations = [
        {
            name: "Kausani",
            slug: "kausani",
            state: "Uttarakhand",
            short_description:
                "A serene hill station known as the 'Switzerland of India', offering panoramic Himalayan views, lush tea gardens and peaceful mountain trails.",
            long_description:
                "Nestled at an altitude of 1,890 metres in the Bageshwar district of Uttarakhand, Kausani is a tranquil hill station famous for its 300 km wide panoramic view of the Himalayan peaks including Trisul, Nanda Devi and Panchachuli. The town is surrounded by dense pine forests and terraced tea gardens. Visitors can explore the stunning Rudradhari Falls and Waterfall, seek blessings at the ancient Baijnath Temple dedicated to Lord Shiva, and enjoy adventure activities like boating, nature trail walks and jungle camping. Kausani offers a perfect escape for nature lovers, honeymooners and anyone seeking peace away from the city hustle.",
            best_time: "March – June, September – November",
            hero_image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
            trending_score: 85
        },
        {
            name: "Haridwar",
            slug: "haridwar",
            state: "Uttarakhand",
            short_description:
                "One of India's seven holiest cities, where the Ganges descends from the mountains to the plains — a spiritual and cultural treasure.",
            long_description:
                "Haridwar, meaning 'Gateway to God', sits at the foothills of the Shivalik ranges where the sacred river Ganga enters the Indo-Gangetic plains. The city is a major pilgrimage destination and one of the four sites of the Kumbh Mela. Key attractions include the iconic Har Ki Pauri ghat famous for its evening Ganga Aarti, the hilltop Mansa Devi Temple accessible by cable car, the revered Chandi Devi Temple, the ancient Saptrishi Ashram where seven sages meditated, the patriotic Bharat Mata Mandir, and the serene Prem Ashram. Haridwar also serves as a base for business tours to the SIDCUL Industrial Area, one of Uttarakhand's largest industrial townships.",
            best_time: "February – April, September – November",
            hero_image: "https://images.unsplash.com/photo-1591018653367-2a3c32b67c9b?auto=format&fit=crop&w=1200&q=80",
            trending_score: 92
        },
        {
            name: "Rishikesh",
            slug: "rishikesh",
            state: "Uttarakhand",
            short_description:
                "The Yoga Capital of the World — where ancient spirituality meets thrilling adventure on the banks of the holy Ganga.",
            long_description:
                "Rishikesh is nestled in the foothills of the Himalayas along the banks of the Ganges and is globally renowned as a centre for yoga, meditation and adventure. The town features iconic landmarks like Laxman Jhula and Ram Jhula — suspension bridges with stunning river views — and the peaceful Parmarth Niketan Ashram which hosts the world's largest daily Ganga Aarti at Triveni Ghat. For spiritual seekers, Neelkanth Mahadev Temple dedicated to Lord Shiva is a must-visit. Adventure enthusiasts can enjoy white-water rafting at Shivpuri, bungee jumping, camping at Mohanchatti, and the scenic Neer Waterfall trek. The Beatles Ashram (Maharishi Mahesh Yogi's former ashram) draws music and history lovers from around the world.",
            best_time: "February – May, September – November",
            hero_image: "https://images.unsplash.com/photo-1600253579212-3827abf59f71?auto=format&fit=crop&w=1200&q=80",
            trending_score: 95
        },
        {
            name: "Jim Corbett",
            slug: "jim-corbett",
            state: "Uttarakhand",
            short_description:
                "India's oldest national park — a wildlife paradise perfect for jungle safaris, temple visits and destination weddings.",
            long_description:
                "Jim Corbett National Park, established in 1936, is India's oldest national park and one of the premier tiger reserves in the country. Spread over 520 sq km of dense forests, river belts and grasslands in the Nainital district of Uttarakhand, it is home to Bengal tigers, elephants, leopards and over 600 species of birds. Key attractions include the Garjia Temple perched on a large rock in the middle of the Kosi River, the Corbett Museum housed in the former residence of Jim Corbett himself, and thrilling jungle safaris through the Bijrani, Jhirna and Dhikala zones. The park's luxury resorts and stunning natural backdrop also make it one of the most sought-after destinations for grand Indian weddings.",
            best_time: "November – June",
            hero_image: "https://images.unsplash.com/photo-1557150076-91b1ff43ca09?auto=format&fit=crop&w=1200&q=80",
            trending_score: 88
        }
    ];

    const createdDestinations = {};

    for (const dest of destinations) {
        try {
            console.log(`🗺️  Creating destination: ${dest.name}...`);
            const result = await adminRequest("/destinations", "POST", dest);
            createdDestinations[dest.name] = result.data.id;
            console.log(`  ✅ Created (ID: ${result.data.id})`);
        } catch (err) {
            console.log(`  ⚠️  ${err.message}`);
        }
    }

    // ── 3. Create Packages ──
    console.log("\n📦 Creating packages...");

    const packages = [
        {
            name: "Kausani Nature Retreat",
            destination: "Kausani",
            summary:
                "Escape to the Himalayan paradise of Kausani with visits to tea gardens, panoramic viewpoints, Rudradhari waterfalls and Baijnath Temple. Includes jungle camping and nature trail walks.",
            duration_days: 4,
            price_from: 8999,
            highlights: [
                "Tea Garden Visit",
                "Himalayan View Point",
                "Snow Fall Point",
                "Rudradhari Waterfall",
                "Baijnath Temple",
                "Boating",
                "Nature Trail Walk",
                "Jungle Camping"
            ],
            is_featured: false
        },
        {
            name: "Haridwar Spiritual Sojourn",
            destination: "Haridwar",
            summary:
                "Immerse yourself in the spiritual energy of Haridwar — experience the mesmerising Ganga Aarti at Har Ki Pauri, seek blessings at Mansa Devi and Chandi Devi temples, and explore ancient ashrams.",
            duration_days: 3,
            price_from: 6499,
            highlights: [
                "Har Ki Pauri Ganga Aarti",
                "Mansa Devi Temple (Cable Car)",
                "Chandi Devi Temple",
                "Saptrishi Ashram",
                "Bharat Mata Mandir",
                "Prem Ashram",
                "SIDCUL Business Tour"
            ],
            is_featured: false
        },
        {
            name: "Rishikesh Adventure & Spirituality",
            destination: "Rishikesh",
            summary:
                "The ultimate Rishikesh experience — from sunrise yoga at Parmarth Niketan to adrenaline-pumping rafting and bungee jumping. Walk across Laxman Jhula, visit the Beatles Ashram and camp under the stars.",
            duration_days: 4,
            price_from: 9999,
            highlights: [
                "Laxman Jhula & Ram Jhula",
                "Parmarth Niketan Ashram",
                "Triveni Ghat Aarti Darshan",
                "Neelkanth Mahadev Temple",
                "White-Water Rafting",
                "Bungee Jumping",
                "Shivpuri Camping",
                "Neer Waterfall Trek",
                "The Beatles Ashram",
                "Mohanchatti Visit"
            ],
            is_featured: true
        },
        {
            name: "Jim Corbett Wildlife Safari",
            destination: "Jim Corbett",
            summary:
                "Explore India's oldest national park with thrilling jungle safaris, a visit to the riverside Garjia Temple and the historic Corbett Museum. Also ideal for destination weddings.",
            duration_days: 3,
            price_from: 7999,
            highlights: [
                "Jungle Safari",
                "Garjia Temple",
                "Corbett Museum",
                "Destination Wedding Venue Options",
                "Birdwatching",
                "Riverside Camping"
            ],
            is_featured: true
        },
        {
            name: "Haridwar-Rishikesh Combo",
            destination: "Haridwar",
            summary:
                "The best of both worlds — combine the spiritual immersion of Haridwar with the adventure and yoga scene of Rishikesh in one seamless trip.",
            duration_days: 5,
            price_from: 12999,
            highlights: [
                "Har Ki Pauri Ganga Aarti",
                "Mansa Devi Temple",
                "Laxman Jhula & Ram Jhula",
                "Rafting at Shivpuri",
                "Triveni Ghat Evening Aarti",
                "Neelkanth Mahadev Temple",
                "Beatles Ashram",
                "Camping Experience"
            ],
            is_featured: true
        }
    ];

    for (const pkg of packages) {
        const destId = createdDestinations[pkg.destination];
        if (!destId) {
            console.log(`  ⚠️  Skipping "${pkg.name}" — destination "${pkg.destination}" not found`);
            continue;
        }
        try {
            console.log(`  📦 Creating: ${pkg.name}...`);
            const result = await adminRequest("/packages", "POST", {
                name: pkg.name,
                destination_id: destId,
                summary: pkg.summary,
                duration_days: pkg.duration_days,
                price_from: pkg.price_from,
                highlights: pkg.highlights,
                is_featured: pkg.is_featured
            });
            console.log(`    ✅ Created (ID: ${result.data.id})`);
        } catch (err) {
            console.log(`    ⚠️  ${err.message}`);
        }
    }

    console.log("\n🎉 Seeding complete!");
}

main().catch(console.error);

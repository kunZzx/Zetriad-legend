// ==========================================
// KONFIGURASI SERVER & KONTAK ZETRIAD LEGEND
// Silakan ubah link WA, Discord, dan Nomor Owner di bawah ini
// ==========================================
const SERVER_CONFIG = {
  name: "Zetriad Legend",
  tagline: "RPG Survival • Custom Skills • Contract & Rank System",
  ip: "zetriad.my.id",
  port: "25666",
  contacts: {
    whatsappGroup: "https://chat.whatsapp.com/GANTI_LINK_GRUP_WA",
    whatsappGroupLabel: "Grup WhatsApp",
    discord: "https://discord.gg/GANTI_LINK_DISCORD",
    discordLabel: "Discord Server",
    ownerPhone: "6281234567890", // Format internasional tanpa + (contoh: 6281234567890)
    ownerDisplay: "+62 812-3456-7890",
    ownerName: "Owner Zetriad"
  }
};

// ==========================================
// DATA TOKO / PRICELIST (01 - 09)
// ==========================================
const SHOP_CATEGORIES = [
  {
    id: "paket-custom",
    number: "01",
    title: "Paket Custom",
    subtitle: "Paket skill kustom dengan bonus Physical, CD SL, dan akses Exclusive.",
    badge: "Best Seller",
    items: [
      {
        name: "Paket Custom Tier 1",
        price: "80K – 90K",
        tier: "starter",
        specs: ["6 Skill", "Physical 300", "CD SL 30"],
        note: "Request Skill (Kecuali Exclusive)"
      },
      {
        name: "Paket Custom Tier 2",
        price: "120K",
        tier: "common",
        specs: ["5 Skill", "Physical 200", "CD SL 30"],
        note: "Request Skill (Kecuali Exclusive)"
      },
      {
        name: "Paket Custom Tier 3",
        price: "150K",
        tier: "rare",
        specs: ["6 Skill", "Physical 350", "CD SL 30"],
        note: "Request Skill (Kecuali Exclusive)"
      },
      {
        name: "Paket Custom Tier 4",
        price: "250K",
        tier: "epic",
        featured: true,
        specs: ["7 Skill + Unlock Fanny", "Physical 450", "CD SL 30"],
        note: "Request Skill (Kecuali Exclusive)"
      },
      {
        name: "Paket Custom Tier 5",
        price: "300K",
        tier: "legend",
        specs: ["7 Skill", "Physical 550", "CD SL 25"],
        note: "Free 1 Skill Exclusive",
        highlightNote: true
      },
      {
        name: "Paket Custom Tier 6",
        price: "450K – 500K",
        tier: "mythic",
        specs: ["7 Skill", "Physical 800", "CD SL 23"],
        note: "Free 2 Skill Exclusive",
        highlightNote: true
      },
      {
        name: "Paket Custom Tier 7",
        price: "600K",
        tier: "abyss",
        featured: true,
        specs: ["7 Skill", "Physical 900", "CD SL 18"],
        note: "Free 3 Skill Exclusive",
        highlightNote: true
      }
    ]
  },
  {
    id: "exclusive-addon",
    number: "02",
    title: "Exclusive Add-On",
    subtitle: "Tambahan skill eksklusif pilihan untuk memperkuat build karaktermu.",
    priceBanner: "Harga : 40K – 55K",
    items: [
      { name: "Kurayagami", price: "40K – 55K", tier: "mythic", note: "Exclusive Skill Add-On" },
      { name: "Savior", price: "40K – 55K", tier: "mythic", note: "Exclusive Skill Add-On" },
      { name: "Gauntlet of Timer", price: "40K – 55K", tier: "mythic", note: "Exclusive Skill Add-On" },
      { name: "Deathrealm", price: "40K – 55K", tier: "mythic", note: "Exclusive Skill Add-On" },
      { name: "Deathfury", price: "40K – 55K", tier: "mythic", note: "Exclusive Skill Add-On" },
      { name: "Dan Masih Banyak Lagi", price: "40K – 55K", tier: "rare", note: "Tanyakan list lengkap ke Owner" }
    ]
  },
  {
    id: "armor-kontrak",
    number: "03",
    title: "Armor Kontrak",
    subtitle: "Set armor kontrak dengan kekuatan pertahanan bertingkat.",
    items: [
      { name: "Noctyra Armor", price: "110K", tier: "abyss", featured: true, note: "Top Tier Contract Armor" },
      { name: "Aurora Armor", price: "90K", tier: "mythic", note: "Contract Armor" },
      { name: "MVP++ Armor", price: "75K", tier: "legend", note: "Contract Armor" },
      { name: "MVP+ Armor", price: "65K", tier: "epic", note: "Contract Armor" },
      { name: "Gladiator Armor", price: "40K", tier: "rare", note: "Contract Armor" },
      { name: "Darkness Armor", price: "25K", tier: "starter", note: "Contract Armor" }
    ]
  },
  {
    id: "max-skills",
    number: "04",
    title: "Max Skills",
    subtitle: "Tingkatkan level skill secara instan tanpa perlu grinding lama.",
    items: [
      { name: "Max 1 Skill", price: "7K", tier: "rare", note: "Maksimalkan 1 skill pilihan" },
      { name: "All Max Skill", price: "75K", tier: "legend", featured: true, note: "Maksimalkan seluruh skill" }
    ]
  },
  {
    id: "battle-pass",
    number: "05",
    title: "Battle Pass",
    subtitle: "Buka hadiah eksklusif musiman dengan Crystalion Premium.",
    items: [
      { name: "Crystalion Premium", price: "100K", tier: "mythic", featured: true, note: "Akses penuh Battle Pass Premium" }
    ]
  },
  {
    id: "book-kontrak",
    number: "06",
    title: "Book Kontrak",
    subtitle: "Buku kontrak dari Basic hingga Zetriad. Bisa tambah Request SL (+5K).",
    infoBox: {
      title: "Catatan Penting",
      lines: [
        "Book + Request SL : +5K",
        "Book dan SL terpisah.",
        "Tersedia pembelian SL saja."
      ]
    },
    items: [
      { name: "Zetriad", price: "175K", tier: "abyss", featured: true, note: "Book + Request SL: +5K" },
      { name: "Glory", price: "150K", tier: "abyss", note: "Book + Request SL: +5K" },
      { name: "Mythical", price: "125K", tier: "mythic", note: "Book + Request SL: +5K" },
      { name: "Mythic", price: "100K", tier: "legend", note: "Book + Request SL: +5K" },
      { name: "Legend", price: "75K", tier: "epic", note: "Book + Request SL: +5K" },
      { name: "Basic", price: "25K", tier: "starter", note: "Book + Request SL: +5K" }
    ]
  },
  {
    id: "sl-exclusive",
    number: "07",
    title: "SL Exclusive",
    subtitle: "Skill Legendary / Soul Limit eksklusif dengan efek tempur luar biasa.",
    items: [
      { name: "Nusantara", price: "300K", tier: "abyss", featured: true, note: "SL Exclusive Tertinggi" },
      { name: "Voidgauntlet", price: "200K", tier: "mythic", note: "SL Exclusive" },
      { name: "Gauntlettime", price: "200K", tier: "mythic", note: "SL Exclusive" },
      { name: "Kuriyagami", price: "185K", tier: "legend", note: "SL Exclusive" },
      { name: "Savior The Light", price: "185K", tier: "legend", note: "SL Exclusive" }
    ]
  },
  {
    id: "ranks",
    number: "08",
    title: "Ranks",
    subtitle: "Dapatkan command spesial, jumlah sethome lebih banyak, dan kit eksklusif.",
    isRankGrid: true,
    items: [
      {
        name: "Abyss",
        price: "200K",
        tier: "abyss",
        featured: true,
        commands: [
          "/sethome 30",
          "/ptime", "/pweather", "/me",
          "/repair", "/repair all",
          "/heal", "/feed", "/nick", "/fly",
          "/ec", "/top", "/bottom", "/itemname"
        ],
        kit: "Kit Abyss"
      },
      {
        name: "Eternal",
        price: "150K",
        tier: "mythic",
        commands: [
          "/sethome 25",
          "/ptime", "/pweather", "/me",
          "/repair", "/repair all",
          "/heal", "/feed", "/nick", "/fly",
          "/ec", "/top", "/bottom", "/itemname"
        ],
        kit: "Kit Eternal"
      },
      {
        name: "Immortal",
        price: "70K",
        tier: "legend",
        commands: [
          "/sethome 15",
          "/ptime", "/pweather", "/me",
          "/repair", "/repair all",
          "/heal", "/feed", "/nick", "/fly",
          "/ec"
        ],
        kit: "Kit Immortal"
      },
      {
        name: "King",
        price: "40K",
        tier: "epic",
        commands: [
          "/sethome 8",
          "/ptime", "/pweather", "/me",
          "/repair", "/heal", "/feed",
          "/nick", "/fly", "/ec"
        ],
        kit: "Kit King"
      },
      {
        name: "Prince",
        price: "25K",
        tier: "rare",
        commands: [
          "/sethome 6",
          "/ptime", "/pweather",
          "/me", "/repair"
        ],
        kit: "Kit Prince"
      }
    ]
  },
  {
    id: "armor-custom",
    number: "09",
    title: "Armor Custom",
    subtitle: "Pesan armor custom sesuai kebutuhan stat & tampilan yang kamu inginkan.",
    items: [
      { name: "Termurah", price: "200K", tier: "rare", note: "Custom Armor Entry" },
      { name: "Sedang", price: "500K", tier: "epic", note: "Custom Armor Menengah" },
      { name: "Termahal", price: "Unlimited", tier: "abyss", featured: true, note: "Custom Armor Bebas / Unlimited" }
    ]
  },
  {
    id: "all-weapons",
    number: "10",
    title: "All Weapon & Skill Texture",
    subtitle: "Koleksi lengkap seluruh 3D tekstur senjata & skill yang ada di server Zetriad Legend. Klik gambar untuk Preview 3D 360°.",
    priceBanner: "10k buat 1 texture",
    items: [
      { name: "Abyssion Sword", price: "Request / Add-On", note: "Abyssion Water Series" },
      { name: "Archer Spirit Bow", price: "Request / Add-On", note: "Archer Spirit Series" },
      { name: "Archmage Staff", price: "Request / Add-On", note: "Archmage Arcane Series" },
      { name: "Frigid Lance", price: "Request / Add-On", note: "Arctic Knight Series" },
      { name: "Darkice Lance", price: "Request / Add-On", note: "Arctic Knight Darkice" },
      { name: "Artificer Blaster", price: "Request / Add-On", note: "Artificer Mecha Series" },
      { name: "Assassin Blade", price: "Request / Add-On", note: "Shadow Assassin Series" },
      { name: "Awakened Galebow", price: "Request / Add-On", note: "Awakened Archer Series" },
      { name: "Dragonlance", price: "Request / Add-On", note: "Awakened Dragon Warrior" },
      { name: "Awakened Runestaff", price: "Request / Add-On", note: "Awakened Mage Series" },
      { name: "Brutesword", price: "Request / Add-On", note: "Awakened Warrior Series" },
      { name: "Curse of Dragon", price: "Request / Add-On", note: "Aysel Dragon Awk" },
      { name: "Barbarian Axe", price: "Request / Add-On", note: "Barbarian Fury Series" },
      { name: "Beastmaster Crossbow", price: "Request / Add-On", note: "Beastmaster Fenrir" },
      { name: "Berserker Battle Axe", price: "Request / Add-On", note: "Berserker Animated Set" },
      { name: "Berserker Greatsword", price: "Request / Add-On", note: "Berserker Animated Set" },
      { name: "Paradox Blackhole", price: "Request / Add-On", note: "Blade of Blackhole" },
      { name: "Blood Scythe", price: "Request / Add-On", note: "Blood Skills Series" },
      { name: "Bloodmoon Orb", price: "Request / Add-On", note: "Bloodmoon Vampire" },
      { name: "Carnage Katana", price: "Request / Add-On", note: "Carnage Class Weapon" },
      { name: "Cetus Greatsword", price: "Request / Add-On", note: "Cetus Leviathan Series" },
      { name: "Champion of Savior", price: "40K – 55K", featured: true, note: "Savior Exclusive Weapon" },
      { name: "Chaos Staff", price: "Request / Add-On", note: "Chaos Inferno Series" },
      { name: "Cleric Mace", price: "Request / Add-On", note: "Divine Cleric Series" },
      { name: "Cosmo Sword", price: "Request / Add-On", note: "Cosmo Gravity Pack" },
      { name: "Ame no Habakiri", price: "Request / Add-On", note: "Mythic Katana Weapon" },
      { name: "Angelic Emissary", price: "Request / Add-On", note: "Celestial Emissary Sword" },
      { name: "Banisher Sword", price: "Request / Add-On", note: "Banisher Custom Weapon" },
      { name: "Dreamrealm Blade", price: "Request / Add-On", note: "Dreamrealm Custom Weapon" },
      { name: "Espada de Samael", price: "Request / Add-On", note: "Samael Demon Blade" },
      { name: "Flame Greatsword", price: "Request / Add-On", note: "Inferno Greatsword" },
      { name: "Red Lion Greatsword", price: "Request / Add-On", note: "Greatsword of Red Lion" },
      { name: "Gryphon Longsword", price: "Request / Add-On", note: "Gryphon HD Weapon" },
      { name: "Lunara Silvers", price: "Request / Add-On", note: "Lunara Moon Blade" },
      { name: "Queen Amethys", price: "Request / Add-On", note: "Royal Amethyst Blade" },
      { name: "Rainbow Prism Sword", price: "Request / Add-On", featured: true, note: "Prismatic Royal Blade" },
      { name: "Shinoyomi Spear", price: "Request / Add-On", note: "Shinoyomi Custom Spear" },
      { name: "Solar Fracture", price: "Request / Add-On", note: "Solar Core Greatsword" },
      { name: "Solis Eterna", price: "Request / Add-On", note: "Eternal Starlight Blade" },
      { name: "Spider Empress Spear", price: "Request / Add-On", note: "Empress Arachnid Spear" },
      { name: "Velvet Fang", price: "Request / Add-On", note: "Crimson Velvet Blade" },
      { name: "Crimson Moon Scythe", price: "Request / Add-On", note: "Darkness Scythe Series" },
      { name: "Darkness Assassin", price: "Request / Add-On", note: "CloudRPG Darkness Blade" },
      { name: "Necroslayer", price: "Request / Add-On", note: "Death Knight Greatsword" },
      { name: "Demonic Sword", price: "Request / Add-On", note: "Demonic Slash Series" },
      { name: "Moonlight Sword", price: "Request / Add-On", note: "Demonic Moonlight Blade" },
      { name: "Sword of Galaxy", price: "Request / Add-On", note: "Demonic Galaxy Blade" },
      { name: "Devil Trident", price: "Request / Add-On", note: "Abyssal Devil Trident" },
      { name: "Diablo Sword", price: "Request / Add-On", note: "Diablo Animated Set" },
      { name: "Soulpiercer", price: "Request / Add-On", note: "Soulpiercer Mythic Spear" },
      { name: "Dimitrios Axe", price: "Request / Add-On", note: "Dimitrios Earthshaker" },
      { name: "Gauntlet of Times", price: "40K – 55K", featured: true, note: "Chrono Time Stop Gauntlet" },
      { name: "Doombringer Axe Evo", price: "Request / Add-On", note: "Darkflame Evolution Axe" },
      { name: "Dragon Warrior Spear", price: "Request / Add-On", note: "Dragonborn Spear" },
      { name: "Sin of Gluttony", price: "Request / Add-On", note: "Gluttony Evolution Blade" },
      { name: "Druid Staff", price: "Request / Add-On", note: "Nature Druid Staff" },
      { name: "Prism Elementalist", price: "Request / Add-On", note: "Elemental Prism Catalyst" },
      { name: "Chronicles Blade", price: "Request / Add-On", note: "Chronicles Animated Set" },
      { name: "Crossbow of Envious", price: "Request / Add-On", note: "Sin of Envy Evolution" },
      { name: "Eugeo Zafkiel Sword", price: "Request / Add-On", note: "Zafkiel Crimson Blade" },
      { name: "Commis Okron", price: "Request / Add-On", note: "Okron Floating Relic" },
      { name: "Fanny Aspirant", price: "Unlock Tier 4", featured: true, note: "Fanny Aspirant Blade" },
      { name: "Flame Warrior Katana", price: "Request / Add-On", note: "Blazing Spirit Katana" },
      { name: "Fluminaria Sword", price: "Request / Add-On", note: "Celestial Sword of Luminaria" },
      { name: "Forest Sword", price: "Request / Add-On", note: "Ancient Forest Claymore" },
      { name: "Galaxy Sword", price: "Request / Add-On", note: "Cosmic Galaxy Weapon" },
      { name: "Windreaver Glaive", price: "Request / Add-On", note: "Gale Glaive Series" },
      { name: "Gladius Primordium", price: "Request / Add-On", note: "Tenebra Primordium" },
      { name: "Goddess Sword", price: "Request / Add-On", note: "Valkyrie Goddess Blade" },
      { name: "Spear of God", price: "Request / Add-On", note: "Goddess Divine Spear" },
      { name: "Scythe of Antares", price: "Request / Add-On", note: "Honor Antares Scythe" },
      { name: "Hyperion Sword", price: "Request / Add-On", note: "Hyperion Dragon Blade" },
      { name: "Ice Side Blade", price: "Request / Add-On", note: "Glacial Ice Side" },
      { name: "Mender Lifecane", price: "Request / Add-On", note: "Khan Mender Staff" },
      { name: "Warrior Battleblade", price: "Request / Add-On", note: "Khan Warrior Remake" },
      { name: "King Arthur Sword", price: "Request / Add-On", note: "Excalibur King Arthur" },
      { name: "Arcana Codex Evo", price: "Request / Add-On", note: "Knowledge Evolution Tome" },
      { name: "Kurayami Katana", price: "40K – 55K", featured: true, note: "Kurayagami Eclipse Katana" },
      { name: "Swordmaster Blade", price: "Request / Add-On", note: "LostAssets Swordmaster" },
      { name: "Revenant Void Blade", price: "Request / Add-On", note: "LostAssets Revenant" },
      { name: "Frost Samurai Katana", price: "Request / Add-On", note: "LostAssets Frost Samurai" },
      { name: "Sin of Lust Evo", price: "Request / Add-On", note: "Lust Evolution Weapon" },
      { name: "Mage Staff", price: "Request / Add-On", note: "Grand Mage Staff" },
      { name: "Monk Gauntlet", price: "Request / Add-On", note: "Dragon Fist Monk" },
      { name: "Monkey God Ruyi", price: "Request / Add-On", note: "Ruyi Jingu Bang Staff" },
      { name: "Northern Yang Sword", price: "Request / Add-On", note: "Northern Celestial Blade" },
      { name: "Keris Nusantara", price: "300K", featured: true, note: "SL Exclusive Nusantara" },
      { name: "Shield Papua", price: "300K (Set)", note: "Perisai Adat Nusantara" },
      { name: "Paladin Hammer", price: "Request / Add-On", note: "Holy Paladin Warhammer" },
      { name: "Pandora Sword", price: "Request / Add-On", note: "Pandora Rune Greatsword" },
      { name: "Watchers Gauntlet", price: "Request / Add-On", note: "Watcher Shield Gauntlet" },
      { name: "Lightbringer Pride", price: "Request / Add-On", note: "Sin of Pride Flaming Sword" },
      { name: "Psycopath Scythe", price: "Request / Add-On", note: "Blood Crimson Scythe" },
      { name: "Reaper Scythe", price: "Request / Add-On", note: "Soul Reaper Scythe" },
      { name: "Avarice Scythe Evo", price: "Request / Add-On", note: "Sin of Greed Evolution" },
      { name: "Ancient Sky Scythe", price: "Request / Add-On", note: "Celestial Reaper Scythe" },
      { name: "Revenant Scythe", price: "40K – 55K", featured: true, note: "Deathrealm Exclusive Scythe" },
      { name: "Martial Gauntlet", price: "Request / Add-On", note: "Samus Martial Artist" },
      { name: "Shark Anchor", price: "Request / Add-On", note: "Abyssal Shark Anchor" },
      { name: "Starlight Blade", price: "Request / Add-On", note: "Starlight Animated Set" },
      { name: "Sunnova Fist", price: "Request / Add-On", note: "Sun God Celestial Fist" },
      { name: "Thor Mjolnir", price: "Request / Add-On", note: "Thunder God Mjolnir" },
      { name: "Vladimir Sword", price: "Request / Add-On", note: "Vampire Lord Blade" },
      { name: "Void Gauntlet", price: "200K", featured: true, note: "SL Exclusive Voidgauntlet" },
      { name: "Warrior Sword", price: "Request / Add-On", note: "Chain Hook Greatsword" },
      { name: "Pink Legacy Sword", price: "Request / Add-On", note: "Pink Legacy Animated Set" },
      { name: "Western Yin Sword", price: "Request / Add-On", note: "Kaguwir Yin Blade" },
      { name: "Doombringer Wrath", price: "40K – 55K", featured: true, note: "Deathfury Exclusive Greatsword" },
      { name: "Yone Dual Sword", price: "Request / Add-On", note: "Spirit Blossom Dual Blade" },
      { name: "Azure Greatsword", price: "Request / Add-On", note: "Greatsword of Azure" },
      { name: "Antares Scythe Evo", price: "Request / Add-On", note: "Celestial Antares Evolution" },
      { name: "Sacred Lance Evo", price: "Request / Add-On", note: "Diligence Sacred Lance" }
    ]
  }
];


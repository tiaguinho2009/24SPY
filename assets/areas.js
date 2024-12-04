let PTFSAPIError = [
    {
        "holder": "Tiaguinho_2009 | ERROR",
        "claimable": false,
        "airport": "Skopelos",
        "position": "tower"
    },
    {
        "holder": "aaronandethan123 | ERROR",
        "claimable": false,
        "airport": "Saint Barthélemy",
        "position": "tower"
    },
    {
        "holder": "AvatarRoblox2018 | ERROR",
        "claimable": false,
        "airport": "Sauthemptona",
        "position": "tower"
    },
    {
        "holder": "BEANZBURGERBEANZ | ERROR",
        "claimable": false,
        "airport": "McConnell",
        "position": "tower"
    },
]

let PTFSAPI = [
    //example
    {
      "holder": "Test",
      "claimable": true,
      "airport": "Tokyo",
      "position": "tower"
    },
    {
      "holder": "",
      "claimable": true,
      "airport": "Tokyo",
      "position": "ground"
    },
    {
      "holder": "",
      "claimable": true,
      "airport": "Barra",
      "position": "tower"
    }
]

const controlAreas = [
    //TMA/RDR
    {
        name: "IRFD TMA",
        type: "polyline",
        coordinates: [
            [513,665],
            [513,630],
            [570,644],
            [570,614],
            [615,626.2],
            [615,655],
            [718,692],
            [737,727],
            [755,790],
            [760,817],
            [769,868],
            [644,927],
            [644,957],
            [479,959],
            [479,792],
            [480,770],
            [465,765],
            [480,740],
            [490,740],
            [513,665],
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ITKO TMA",
        type: "polyline",
        coordinates: [
            [675,230],
            [675,310],
            [610,375],
            [433,375],
            [407,355],
            [370,240],
            [370,120],
            [475,120],
            [510,140],
            [545,140],
            [590,175],
            [635.3,175],
            [675,230]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IDCS TMA",
        type: "polyline",
        coordinates: [
            [475,120],
            [510,140],
            [545,140],
            [590,175],
            [635.3,175],
            [610,140],
            [645,120],
            [645,50],
            [475,50],
            [475,120]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IMLR TMA",
        type: "polyline",
        coordinates: [
            [320.5,858.5],
            [390,790],
            [465,765],
            [480,740],
            [490,740],
            [513,665],
            [513,630],
            [475,588.4],
            [366,559],
            [282,626],
            [282,822],
            [320.5,858.5]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IGAR TMA",
        type: "polyline",
        coordinates: [
            [479,927],
            [479,792],
            [480,770],
            [465,765],
            [390,790],
            [362,817],
            [320.5,858.5],
            [362,898],
            [362,927],
            [479,927]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ILAR TMA",
        type: "polyline",
        coordinates: [
            [644,927],
            [769,868],
            [760,817],
            [925,773],
            [925,840],
            [900,890],
            [900,920],
            [750,975],
            [680,975],
            [644,1000],
            [644,927]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IPAP TMA",
        type: "polyline",
        coordinates: [
            [925,773],
            [978,759],
            [1021,796],
            [1021,845],
            [1055,880],
            [1055,990],
            [1021,1025],
            [1021,1100],
            [915,1100],
            [915,1030],
            [930,1000],
            [930,960],
            [900,960],
            [850,950],
            [850,938.4],
            [900,920],
            [900,890],
            [925,840],
            [925,773]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IIAB TMA",
        type: "polyline",
        coordinates: [
            [915,1100],
            [915,1030],
            [930,1000],
            [930,960],
            [900,960],
            [850,950],
            [850,938.4],
            [750,975],
            [680,975],
            [644,1000],
            [644,1040],
            [750,1100],
            [915,1100]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IPPH TMA",
        type: "polyline",
        coordinates: [
            [714,250],
            [800,250],
            [900,300],
            [930,360],
            [920,410],
            [856,500],
            [797,529],
            [764,432],
            [714,410],
            [714,250]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IZOL TMA",
        type: "polyline",
        coordinates: [
            [910,575],
            [909,626],
            [986,633],
            [982,660],
            [980,690],
            [1015,730],
            [1100,730],
            [1155,710],
            [1200,665],
            [1200,570],
            [1180,525],
            [1145,500],
            [1075,500],
            [1034,440],
            [996.5,464.5],
            [1040,530],
            [1005,560],
            [995,585],
            [910,575]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ISCM TMA",
        type: "polyline",
        coordinates: [
            [996.5,464.5],
            [1040,530],
            [1005,560],
            [995,585],
            [910,575],
            [910,500],
            [943,500],
            [996.5,464.5]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IGRV TMA",
        type: "polyline",
        coordinates: [
            [90,650],
            [220,650],
            [282,626],
            [303,609.2],
            [303,490],
            [210,420],
            [50,500],
            [90,580],
            [90,650]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ISAU TMA",
        type: "polyline",
        coordinates: [
            [40,980],
            [205,980],
            [320.5,858.5],
            [282,822],
            [282,786],
            [187,750],
            [40,750],
            [40,980]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IBTH TMA",
        type: "polyline",
        coordinates: [
            [570,614],
            [692,647],
            [765,647],
            [797,529],
            [764,432],
            [630,432],
            [570,490],
            [570,614]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    // FIRs
    {
        name: "IRFD FIR",
        type: "polyline",
        coordinates: [
            [644, 1200],
            [644, 927],
            [769, 868],
            [760, 817],
            [755, 790],
            [737, 727],
            [718, 692],
            [692, 647],
            [366, 559],
            [282, 626],
            [282, 686],
            [282, 822],
            [362, 898],
            [362, 1200],
            [644, 1200]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ISKP FIR",
        type: "polyline",
        coordinates: [
            [760, 817],
            [755, 790],
            [737, 727],
            [718, 692],
            [836, 651],
            [909, 626],
            [986, 633],
            [982, 660],
            [960, 683],
            [964, 747],
            [978, 759],
            [760, 817]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ISAU FIR",
        type: "polyline",
        coordinates: [
            [362, 1200],
            [0, 1200],
            [0, 718],
            [134, 730],
            [282, 786],
            [282, 822],
            [362, 898],
            [362, 1200]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ILAR FIR",
        type: "polyline",
        coordinates: [
            [760, 817],
            [978, 759],
            [1021, 796],
            [1200, 832],
            [1200, 1200],
            [644, 1200],
            [644, 927],
            [769, 868],
            [760, 817]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IGRV FIR",
        type: "polyline",
        coordinates: [
            [0,718],
            [134,730],
            [282,786],
            [282,626],
            [366,559],
            [415,450],
            [274,0],
            [0,0],
            [0,718]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "ITKO FIR",
        type: "polyline",
        coordinates: [
            [415,450],
            [433,410],
            [714,410],
            [714,0],
            [274,0]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IPPH FIR",
        type: "polyline",
        coordinates: [
            [714,0],
            [714,410],
            [764,432],
            [797,529],
            [856,500],
            [943,500],
            [1034,440],
            [1120,402],
            [1200,403],
            [1200,0],
            [714,0]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IZOL FIR",
        type: "polyline",
        coordinates: [
            [797,529],
            [856,578],
            [836,651],
            [909, 626],
            [986, 633],
            [982, 660],
            [960, 683],
            [964, 747],
            [978, 759],
            [1021,796],
            [1200,832],
            [1200,403],
            [1120,402],
            [1034,440],
            [943,500],
            [856,500],
            [797,529]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "IBTH FIR",
        type: "polyline",
        coordinates: [
            [433,410],
            [415,450],
            [366,559],
            [692,647],
            [718,692],
            [836,651],
            [856,578],
            [797,529],
            [764,432],
            [714,410],
            [433,410]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },
    {
        name: "Map",
        type: "polyline",
        coordinates: [
            [0, 0],
            [0, 1200],
            [1200, 1200],
            [1200, 0],
            [0, 0]
        ],
        color: "rgba(45,45,45,1)",
        active: true
    },

    //APPs
    {
        name: "IRFD APP",
        type: "polygon",
        tmaReference: "IRFD TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "ITKO APP",
        type: "polygon",
        tmaReference: "ITKO TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "ILAR APP",
        type: "polygon",
        tmaReference: "ILAR TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IPPH APP",
        type: "polygon",
        tmaReference: "IPPH TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IZOL APP",
        type: "polygon",
        tmaReference: "IZOL TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IGRV APP",
        type: "polygon",
        tmaReference: "IGRV TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "ISAU APP",
        type: "polygon",
        tmaReference: "ISAU TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IMLR APP",
        type: "polygon",
        tmaReference: "IMLR TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IGAR APP",
        type: "polygon",
        tmaReference: "IGAR TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IPAP APP",
        type: "polygon",
        tmaReference: "IPAP TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IIAB APP",
        type: "polygon",
        tmaReference: "IIAB TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "ISCM APP",
        type: "polygon",
        tmaReference: "ISCM TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IBTH APP",
        type: "polygon",
        tmaReference: "IBTH TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    {
        name: "IDCS APP",
        type: "polygon",
        tmaReference: "IDCS TMA",
        color: "rgba(255, 122, 0,1)",
        fillColor: "rgba(255, 122, 0, 0)",
        active: false,
        atc: "",
    },
    // CTRs
    {
        name: "IRFD CTR",
        type: "polygon",
        firReference: "IRFD FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [470,1000],
        active: false,
        atc: "",
    },
    {
        name: "ISAU CTR",
        type: "polygon",
        firReference: "ISAU FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [170,1000],
        active: false,
        atc: "",
    },
    {
        name: "ILAR CTR",
        type: "polygon",
        firReference: "ILAR FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [1000,1000],
        active: false,
        atc: "",
    },
    {
        name: "IGRV CTR",
        type: "polygon",
        firReference: "IGRV FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [150,400],
        active: false,
        atc: "",
    },
    {
        name: "ITKO CTR",
        type: "polygon",
        firReference: "ITKO FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [535,370],
        active: false,
        atc: "",
    },
    {
        name: "IPPH CTR",
        type: "polygon",
        firReference: "IPPH FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [950,400],
        active: false,
        atc: "",
    },
    {
        name: "IZOL CTR",
        type: "polygon",
        firReference: "IZOL FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [1000,750],
        active: false,
        atc: "",
    },
    {
        name: "IBTH CTR",
        type: "polygon",
        firReference: "IBTH FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [500,550],
        active: false,
        atc: "",
    },
    {
        name: "ISKP CTR",
        type: "polygon",
        firReference: "ISKP FIR",
        color: "rgba(0, 90, 50, 1)",
        fillColor: "rgba(0, 90, 50, 0.05)",
        center: [500,550],
        active: false,
        atc: "",
    },

    // Airports
    //0
    {
        name: "IRFD",
        real_name: "Rockford",
        type: "Airport",
        app: "IRFD APP",
        originalscale: 0,
        scale: 0,
        coordinates: [583.95, 795.56],
        towerfreq: "124.850",
        groundfreq: "121.855",
        tower: false,
        ground: false,
        ctr: "IRFD CTR",
        atc: "",
        towerAtc: "",
        groundATC: "",
        atcs: [
            "Rockford Tower",
            "Rockford Ground"
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IRFD%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1a8ZqQjxqUC99J5oSskeH6dmsBeDTRUb9/view?usp=sharing"],
            ["AeroNav SOP", "https://docs.google.com/document/d/1_g0U7Zf4VtxZSkpNLzIEAaU4rEW0m-Uma1jnO_BoCvU/edit?usp=sharing"],
        ],
    },
    {
        name: "IPPH",
        real_name: "Perth",
        type: "Airport",
        app: "IPPH APP",
        originalscale: 0,
        scale: 0,
        coordinates: [796,362],
        towerfreq: "135.250",
        groundfreq: "121.700",
        tower: false,
        ground: false,
        ctr: "IPPH CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Perth Tower",
            "Perth Ground"
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IPPH%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1Qhg6zRsIBAjeC_iidsy39FVt5UZhdi5o/view?usp=sharing"],
            ["AeroNav SOP", "https://docs.google.com/document/d/1s4xXrrKYt5BMCcXUvx5RF-wo76cAQ0ot6XVZEQvNiIc/edit?usp=sharing"],
        ],
    },
    {
        name: "IZOL",
        real_name: "Izolirani",
        type: "Airport",
        app: "IZOL APP",
        originalscale: 0,
        scale: 0,
        coordinates: [1074,611],
        towerfreq: "125.640",
        groundfreq: "120.900",
        tower: false,
        ground: false,
        ctr: "IZOL CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Izolirani Tower",
            "Izolirani Ground"
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IZOL%20Ground%20Chart.png"],
        ],
    },
    {
        name: "ITKO",
        real_name: "Tokyo",
        type: "Airport",
        app: "ITKO APP",
        originalscale: 0,
        scale: 0,
        coordinates: [528,242],
        towerfreq: "132.300",
        groundfreq: "121.625",
        tower: false,
        ground: false,
        ctr: "ITKO CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Tokyo Tower",
            "Tokyo Ground"
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ITKO%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1iYxp9qz4f7C6o5DaMVQQufx9rInLcmJh/view?usp=sharing"],
            ["AeroNav SOP", "https://docs.google.com/document/d/1MleQXy5h_2zbMrS6Iu0hUmH8W3qgtK7lCWtkHwVkxFI/edit?usp=sharing"],
        ],
    },
    {
        name: "ILAR",
        real_name: "Larnaca",
        type: "Airport",
        app: "ILAR APP",
        originalscale: 0,
        scale: 0,
        coordinates: [832.00, 913.00],
        towerfreq: "126.300",
        groundfreq: "119.400",
        tower: false,
        ground: false,
        ctr: "ILAR CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Larnaca Tower",
            "Larnaca Ground"
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ILAR%20Ground%20Chart.png"],
            ["TUGACHARTS", "https://drive.google.com/file/d/1ofmuravfpMXW1d4B9M43MyOGbc1RORCs/view"],
            ["AeroNav SOP", "https://docs.google.com/document/d/1TjaEmv7gd2SwcySAZwSr3r8-7cEVl_5vH-5IiaiqokE/edit?usp=sharing"],
        ],
    },
    {
        name: "IGRV",
        real_name: "Grindavik",
        type: "Airport",
        app: "IGRV APP",
        originalscale: 0,
        scale: 0,
        coordinates: [162,546],
        towerfreq: "126.750",
        tower: false,
        ctr: "IGRV CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Grindavik Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IGRV%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1G4M1CGxjXO688x-l7WBnD8UfhiLq2yrB/view?usp=sharing"],
        ],
    },
    {
        name: "IBTH",
        real_name: "Saint Barthélemy",
        type: "Airport",
        app: "IBTH APP",
        originalscale: 0,
        scale: 0,
        coordinates: [670,529],
        towerfreq: "128.600",
        tower: false,
        ctr: "IBTH CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Saint Barthélemy Tower",
        ],
        oceanic: true,
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IBTH%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1OSWgKHBnu8ch3sP68erv8_nVcAFIY7CQ/view?usp=sharing"],
        ],
    },
    {
        name: "ISAU",
        real_name: "Sauthemptona",
        type: "Airport",
        app: "ISAU APP",
        originalscale: 0,
        scale: 0,
        coordinates: [131,863],
        towerfreq: "127.820",
        tower: false,
        ctr: "ISAU CTR",
        towerATC: "",
        groundATC: "",
        atcs: [
            "Sauthemptona Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ISAU%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1m18kxQhwlVMXoY4T8FSIHtmz_ohooGbI/view?usp=sharing"],
        ],
    },
    //1
    {
        name: "IPAP",
        real_name: "Paphos",
        type: "Airport",
        app: "IPAP APP",
        originalscale: 1,
        scale: 1,
        coordinates: [940.43, 931.13],
        towerfreq: "130.625",
        tower: false,
        towerATC: "",
        atcs: [
            "Paphos Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IPAP%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1Ckwrvr93OBZxEfpSwTzc75ALkCmjqsqr/view?usp=sharing"],
            ["AeroNav ILAR SOP", "https://docs.google.com/document/d/1TjaEmv7gd2SwcySAZwSr3r8-7cEVl_5vH-5IiaiqokE/edit?usp=sharing"],
        ],
    },
    {
        name: "IMLR",
        real_name: "Mellor",
        type: "Airport",
        app: "IMLR APP",
        originalscale: 1,
        scale: 1,
        coordinates: [407.90, 729.67],
        towerfreq: "125.650",
        tower: false,
        towerATC: "",
        groundATC: "",
        atcs: [
            "Mellor Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IMLR%20Ground%20Chart.png"],
        ],
    },
    {
        name: "IDCS",
        real_name: "Saba",
        type: "Airport",
        app: "IDCS APP",
        originalscale: 1,
        scale: 1,
        coordinates: [560.17, 109.67],
        towerfreq: "118.250",
        tower: false,
        towerATC: "",
        atcs: [
            "Saba Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IDCS%20Ground%20Chart.png"],
        ],
    },
    {
        name: "IGAR",
        real_name: "Garry",
        type: "Airport",
        app: "IGAR APP",
        originalscale: 1,
        scale: 1,
        coordinates: [440.93, 820.24],
        towerfreq: "124.275",
        tower: false,
        towerATC: "",
        atcs: [
            "Garry Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IGAR%20Ground%20Chart.png"],
        ],
    },
    {
        name: "IIAB",
        real_name: "McConnell",
        type: "Airport",
        app: "IIAB APP",
        originalscale: 1,
        scale: 1,
        coordinates: [849.00, 996.00],
        towerfreq: "127.250",
        tower: false,
        towerATC: "",
        atcs: [
            "McConnell Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IIAB%20Ground%20Chart.png"],
            ["AeroNav", "https://drive.google.com/file/d/1opJg195YF73dI5t-tsQ88hyoIC9eoBde/view?usp=sharing"],
            ["AeroNav ILAR SOP", "https://docs.google.com/document/d/1TjaEmv7gd2SwcySAZwSr3r8-7cEVl_5vH-5IiaiqokE/edit?usp=sharing"],
        ],
    },
    {
        name: "ISCM",
        real_name: "Scampton",
        type: "Airport",
        app: "ISCM APP",
        originalscale: 1,
        scale: 1,
        coordinates: [988.00, 525.00],
        towerfreq: "None",
        tower: false,
        towerATC: "",
        atcs: [
            "Scampton Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ISCM%20Ground%20Chart.png"],
        ],
    },
    //2
    {
        name: "IBLT",
        real_name: "Boltic",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [493.87, 757.33],
        towerfreq: "None",
        tower: false,
        towerATC: "",
        atcs: [
            "Boltic Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IBLT%20Ground%20Chart.png"],
        ],
    },
    {
        name: "ILKL",
        real_name: "Lukla",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [844.00, 408.00],
        towerfreq: "120.150",
        tower: false,
        towerATC: "",
        atcs: [
            "Lukla Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ILKL%20Ground%20Chart.png"],
        ],
    },
    {
        name: "ITRN",
        real_name: "Training Centre",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [589.33, 892.00],
        towerfreq: "None",
        tower: false,
        towerATC: "",
        atcs: [
            "Training Centre Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ITRN%20Ground%20Chart.png"],
        ],
    },
    {
        name: "IJAF",
        real_name: "Al Najaf",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [1087.76, 576.64],
        towerfreq: "120.200",
        tower: false,
        towerATC: "",
        atcs: [
            "Al Najaf Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IJAF%20Ground%20Chart.png"],
        ],
    },
    {
        name: "IHEN",
        real_name: "Henstridge",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [788.62, 1004.13],
        towerfreq: "130.250",
        tower: false,
        towerATC: "",
        atcs: [
            "Henstridge Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IHEN%20Ground%20Chart.png"],
        ],
    },
    {
        name: "IBAR",
        real_name: "Barra",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [897.02, 973.33],
        towerfreq: "118.080",
        tower: false,
        towerATC: "",
        atcs: [
            "Barra Tower",
        ],
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/IBAR%20Ground%20Chart.png"],
        ],
    },
    {
        name: "ISKP",
        real_name: "Skopelos",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [873.80, 714.13],
        towerfreq: "124.200",
        ctr: "ISKP CTR",
        tower: false,
        towerATC: "",
        atcs: [
            "Skopelos Tower",
        ],
        oceanic: true,
        charts: [
            ["Official", "https://ptfs.xyz/charts/dark/ISKP%20Ground%20Chart.png"],
            //["TUGACHARTS", "https://drive.google.com/file/d/1BEaoKLa9hvXCPPKdkc4IGa9Wc22OXr0s/view"]//NOT PUBLISHIED YET
        ],
    },
    {
        name: "SHV",
        real_name: "Sea Haven",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [857.51, 358.51],
        towerfreq: "None",
        tower: false,
        towerATC: "",
        atcs: [
            "Sea Haven Tower",
        ],
        charts: [
            ["Official", "https://github.com/Treelon/ptfs-charts/blob/main/Perth/Sea%20Haven/SHV%20Ground%20Chart.svg"]
        ],
    },
    {
        name: "OWO",
        real_name: "Waterloo",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [541.07, 712.27],
        towerfreq: "None",
        tower: false,
        towerATC: "",
        atcs: [
            "Waterloo Tower",
        ],
    },
    {
        name: "TVO",
        real_name: "Tavaro Seabase",
        type: "Airport",
        originalscale: 2,
        scale: 2,
        coordinates: [170.76, 568.00],
        towerfreq: "None",
        tower: false,
        towerATC: "",
        atcs: [
            "Tavaro Tower",
        ],
    },
];

const Waypoints = [
    ////EXAMPLES
    //Waypoints
    //{ name: "WAYPO", type: "Waypoint", coordinates: [, ] },
    //VORs
    //{ name: "VOR", type: "VOR", coordinates: [, ] },

    ////IRFD FIR
    //Waypoints
    { name: "ENDER", type: "Waypoint", coordinates: [401.64, 593.26] },
    { name: "KENED", type: "Waypoint", coordinates: [492.85, 622.96] },
    { name: "SETHR", type: "Waypoint", coordinates: [651.95, 663.27] },
    { name: "SUNST", type: "Waypoint", coordinates: [345.07, 637.81] },
    { name: "BUCFA", type: "Waypoint", coordinates: [407.29, 673.17] },
    { name: "KUNAV", type: "Waypoint", coordinates: [493.56, 681.65] },
    { name: "HAWFA", type: "Waypoint", coordinates: [531.74, 701.45] },
    { name: "QUEEN", type: "Waypoint", coordinates: [588.11, 739.51] },
    { name: "LAVNO", type: "Waypoint", coordinates: [639.93, 762.97] },
    { name: "ATPEV", type: "Waypoint", coordinates: [673.17, 750.24] },
    { name: "SAWPE", type: "Waypoint", coordinates: [320.32, 694.38] },
    { name: "ICTAM", type: "Waypoint", coordinates: [473.05, 710.64] },
    { name: "BEANS", type: "Waypoint", coordinates: [325.98, 775.70] },
    { name: "LOGAN", type: "Waypoint", coordinates: [400.22, 791.25] },
    { name: "MOGTA", type: "Waypoint", coordinates: [494.97, 819.54] },
    { name: "JAMSI", type: "Waypoint", coordinates: [709.23, 810.34] },
    { name: "EXMOR", type: "Waypoint", coordinates: [413.66, 853.48] },
    { name: "PEPUL", type: "Waypoint", coordinates: [524.67, 873.98] },
    { name: "GODLU", type: "Waypoint", coordinates: [651.95, 859.13] },
    { name: "LAZER", type: "Waypoint", coordinates: [702.16, 879.64] },
    { name: "EMJAY", type: "Waypoint", coordinates: [457.50, 946.82] },
    { name: "ODOKU", type: "Waypoint", coordinates: [574.88, 946.82] },
    { name: "DEATH", type: "Waypoint", coordinates: [412.24, 1063.43] },
    { name: "TRELN", type: "Waypoint", coordinates: [506.29, 1041.57] },
    { name: "REAPR", type: "Waypoint", coordinates: [601.04, 1026.01] },
    //VORs
    { name: "MLR", type: "VOR", coordinates: [409.41, 733.98] },
    { name: "BLA", type: "VOR", coordinates: [533.16, 736.81] },
    { name: "RFD", type: "VOR", coordinates: [574.31, 787.01] },
    { name: "GRY", type: "VOR", coordinates: [444.77, 819.54] },
    { name: "TRN", type: "VOR", coordinates: [591.14, 887.42] },

    ////ITKO FIR
    //Waypoints
    { name: "SHELL", type: "Waypoint", coordinates: [341.00, 161.50] },
    { name: "KIKON", type: "Waypoint", coordinates: [494.00, 142.50] },
    { name: "CHILY", type: "Waypoint", coordinates: [661.50, 159.00] },
    { name: "SHIBA", type: "Waypoint", coordinates: [427.50, 188.00] },
    { name: "LETSE", type: "Waypoint", coordinates: [573.00, 214.00] },
    { name: "HONDA", type: "Waypoint", coordinates: [692.00, 214.00] },
    { name: "ASTRO", type: "Waypoint", coordinates: [456.50, 258.50] },
    { name: "GULEG", type: "Waypoint", coordinates: [387.00, 307.50] },
    { name: "PIPER", type: "Waypoint", coordinates: [479.00, 314.50] },
    { name: "ONDER", type: "Waypoint", coordinates: [561.50, 335.00] },
    { name: "KNIFE", type: "Waypoint", coordinates: [637.00, 317.50] },
    { name: "TUDEP", type: "Waypoint", coordinates: [449.50, 383.00] },
    { name: "ALLRY", type: "Waypoint", coordinates: [690.00, 383.50] },
    //VORs
    { name: "HME", type: "VOR", coordinates: [534.00, 246.50] },

    ////IPPH FIR
    //Waypoints
    { name: "CRAZY", type: "Waypoint", coordinates: [812.11, 218.53] },
    { name: "WOTAN", type: "Waypoint", coordinates: [979.68, 236.94] },
    { name: "WAGON", type: "Waypoint", coordinates: [1082.81, 269.47] },
    { name: "WELLS", type: "Waypoint", coordinates: [880.24, 307.53] },
    { name: "SQUID", type: "Waypoint", coordinates: [1003.62, 309.37] },
    { name: "ZESTA", type: "Waypoint", coordinates: [1111.66, 335.77] },
    { name: "TINDR", type: "Waypoint", coordinates: [726.17, 345.59] },
    { name: "NOONU", type: "Waypoint", coordinates: [927.51, 378.74] },
    { name: "KELLA", type: "Waypoint", coordinates: [980.91, 382.42] },
    { name: "STRAX", type: "Waypoint", coordinates: [744.58, 396.54] },
    { name: "SISTA", type: "Waypoint", coordinates: [960.04, 442.58] },
    { name: "TALIS", type: "Waypoint", coordinates: [890.68, 453.63] },
    //VORs
    { name: "COC", type: "VOR", coordinates: [778.35, 297.71] },
    { name: "PER", type: "VOR", coordinates: [786.94, 362.78] },
    { name: "BTM", type: "VOR", coordinates: [874.10, 371.99] },
    { name: "ORG", type: "VOR", coordinates: [815.79, 418.02] },

    ////ILAR FIR
    //Waypoints
    { name: "FORIA", type: "Waypoint", coordinates: [683.25, 1010.62] },
    { name: "AQWRT", type: "Waypoint", coordinates: [776.12, 953.12] },
    { name: "FORCE", type: "Waypoint", coordinates: [825.02, 1078.34] },
    { name: "GRASS", type: "Waypoint", coordinates: [805.39, 848.35] },
    { name: "RENTS", type: "Waypoint", coordinates: [885.47, 814.23] },
    { name: "MASEV", type: "Waypoint", coordinates: [836.68, 1040.51] },
    { name: "JACKI", type: "Waypoint", coordinates: [975.12, 886.19] },
    { name: "ALTRS", type: "Waypoint", coordinates: [989.95, 1080.46] },
    { name: "MUONE", type: "Waypoint", coordinates: [1022.48, 1011.87] },
    { name: "BOBUX", type: "Waypoint", coordinates: [1035.91, 945.40] },
    { name: "DEBUG", type: "Waypoint", coordinates: [1112.99, 887.42] },
    { name: "JAZZR", type: "Waypoint", coordinates: [1111.57, 1011.87] },
    { name: "NUBER", type: "Waypoint", coordinates: [1197.84, 959.54] },
    //VORs
    { name: "DIR", type: "VOR", coordinates: [746.75,1031.25] },
    { name: "CAN", type: "VOR", coordinates: [719.00, 982.75] },
    { name: "LCK", type: "VOR", coordinates: [838.50, 909.00] },
    { name: "KIN", type: "VOR", coordinates: [929.50, 868.50] },
    { name: "PFO", type: "VOR", coordinates: [936.50, 935.25] },
    { name: "HUT", type: "VOR", coordinates: [931.00, 985.75] },
    
    ////IZOL FIR
    //Waypoints
    { name: "CAMEL", type: "Waypoint", coordinates: [831.75, 515.62] },
    { name: "DUNKS", type: "Waypoint", coordinates: [907.87, 518.69] },
    { name: "ROSMO", type: "Waypoint", coordinates: [1031.86, 483.09] },
    { name: "UDMUG", type: "Waypoint", coordinates: [1147.88, 437.05] },
    { name: "CYRIL", type: "Waypoint", coordinates: [889.45, 584.37] },
    { name: "MORRD", type: "Waypoint", coordinates: [1147.88, 558.59] },
    { name: "LLIME", type: "Waypoint", coordinates: [1181.64, 495.37] },
    { name: "DOGGO", type: "Waypoint", coordinates: [990.73, 652.51] },
    { name: "ABSRS", type: "Waypoint", coordinates: [1197.60, 646.37] },
    { name: "BILLO", type: "Waypoint", coordinates: [1110.43, 691.79] },
    { name: "JUSTY", type: "Waypoint", coordinates: [1016.51, 740.90] },
    { name: "CHAIN", type: "Waypoint", coordinates: [1196.98, 769.14] },
    //VORs
    { name: "HOT", type: "VOR", coordinates: [987.05, 534.04] },
    { name: "NJF", type: "VOR", coordinates: [1095.09, 582.53] },
    { name: "IZO", type: "VOR", coordinates: [1084.04, 621.20] },
    { name: "DIZ", type: "VOR", coordinates: [1127.01, 626.11] },
    { name: "TRE", type: "VOR", coordinates: [981.53, 587.44] },
    { name: "DET", type: "VOR", coordinates: [1107.98, 760.54] },

    ////IGRV FIR
    //Waypoints
    { name: "BULLY", type: "Waypoint", coordinates: [273.77, 279.30] },
    { name: "FROOT", type: "Waypoint", coordinates: [206.25, 354.18] },
    { name: "EURAD", type: "Waypoint", coordinates: [340.68, 375.05] },
    { name: "BOBOS", type: "Waypoint", coordinates: [136.27, 415.57] },
    { name: "BLANK", type: "Waypoint", coordinates: [368.92, 433.37] },
    { name: "THENR", type: "Waypoint", coordinates: [204.41, 449.33] },
    { name: "ACRES", type: "Waypoint", coordinates: [ 86.55, 469.59] },
    { name: "YOUTH", type: "Waypoint", coordinates: [282.98, 488.00] },
    { name: "UWAIS", type: "Waypoint", coordinates: [ 32.53, 518.08] },
    { name: "EZYDB", type: "Waypoint", coordinates: [373.21, 533.42] },
    { name: "FRANK", type: "Waypoint", coordinates: [ 38.67, 596.04] },
    { name: "CELAR", type: "Waypoint", coordinates: [229.58, 628.57] },
    { name: "THAGC", type: "Waypoint", coordinates: [ 38.06, 681.36] },
    { name: "SHREK", type: "Waypoint", coordinates: [133.82, 688.73] },
    { name: "SPACE", type: "Waypoint", coordinates: [234.49, 707.75] },
    //VORs
    { name: "GOL", type: "VOR", coordinates: [112.95, 553.68] },
    { name: "GVK", type: "VOR", coordinates: [160.21, 544.47] },
    { name: "HAW", type: "VOR", coordinates: [203.79, 517.47] },

    ////ISAU FIR
    //Waypoints
    { name: "HACKE", type: "Waypoint", coordinates: [53.00, 791.00] },
    { name: "GEORG", type: "Waypoint", coordinates: [143.00, 816.50] },
    { name: "SEEKS", type: "Waypoint", coordinates: [237.00, 847.00] },
    { name: "HECKS", type: "Waypoint", coordinates: [31.00, 890.50] },
    { name: "PACKT", type: "Waypoint", coordinates: [107.00, 911.00] },
    { name: "STACK", type: "Waypoint", coordinates: [207.50, 946.00] },
    { name: "ALDER", type: "Waypoint", coordinates: [329.50, 922.50] },
    { name: "WASTE", type: "Waypoint", coordinates: [101.00, 995.50] },
    { name: "HOGGS", type: "Waypoint", coordinates: [314.50, 986.00] },
    { name: "ROBUX", type: "Waypoint", coordinates: [268.50, 1067.50] },
    //VORs
    { name: "KRT", type: "VOR", coordinates: [82.50, 834.00] },
    { name: "SAU", type: "VOR", coordinates: [136.50, 860.50] },
    { name: "BAR", type: "VOR", coordinates: [222.50, 891.50] },

    ////IBTH FIR
    //Waypoints
    { name: "GERLD", type: "Waypoint", coordinates: [443.50, 422.50] },
    { name: "RENDR", type: "Waypoint", coordinates: [487.00, 432.00] },
    { name: "JOOPY", type: "Waypoint", coordinates: [589.50, 421.50] },
    { name: "PROBE", type: "Waypoint", coordinates: [530.50, 471.00] },
    { name: "DINER", type: "Waypoint", coordinates: [654.00, 476.50] },
    { name: "WELSH", type: "Waypoint", coordinates: [486.50, 531.50] },
    { name: "INDEX", type: "Waypoint", coordinates: [545.50, 569.50] },
    { name: "GAVIN", type: "Waypoint", coordinates: [679.00, 590.00] },
    { name: "SILVA", type: "Waypoint", coordinates: [798.00, 592.00] },
    { name: "OCEEN", type: "Waypoint", coordinates: [735.00, 628.50] },
    //VORs
    { name: "ROM", type: "VOR", coordinates: [710.50, 468.50] },
    { name: "RES", type: "VOR", coordinates: [612.00, 535.50] },
    { name: "VOX", type: "VOR", coordinates: [737.50, 532.00] },

    ////ISKP FIR
    //Waypoints
    { name: "ANYMS", type: "Waypoint", coordinates: [768.00, 764.50] },
    { name: "CAWZE", type: "Waypoint", coordinates: [815.62, 659.12] },
    //VORs
    { name: "CLR", type: "VOR", coordinates: [829.87, 731.75] },
    { name: "DEL", type: "VOR", coordinates: [912.12, 696.25] },


];

// Função para aplicar coordenadas da FIR para a CTR correspondente e sincronizar o valor de active
function assignCTRCoordinates() {
    controlAreas.forEach(area => {
        // Verifica e copia coordenadas da FIR, se existir referência
        if (area.firReference) {
            const firArea = controlAreas.find(fir => fir.name === area.firReference);
            if (firArea) {
                area.coordinates = firArea.coordinates;
            }

            // Sincroniza o valor active da CTR com o valor tower do aeroporto correspondente
            const airport = controlAreas.find(ap => ap.type === "Airport" && ap.ctr === area.name);
            if (airport) {
                area.active = airport.tower;
            }
        }

        // Verifica e copia coordenadas da TMA, se existir referência
        if (area.tmaReference) {
            const tmaArea = controlAreas.find(tma => tma.name === area.tmaReference);
            if (tmaArea) {
                area.coordinates = tmaArea.coordinates;
            }

            // Sincroniza o estado ativo/inativo da APP com o estado da TMA correspondente
            if (tmaArea) {
                area.active = tmaArea.active;
            }
        }
    });
}

assignCTRCoordinates();

const settings = [
    'showAirportUI',
    'showFIRlines',
    'showAPPlines',
    'showOnlineATC',
    'showNavaids',
    'showNavaidsLabels',
];

const settingsValues = {
    //default
    showAirportUI: true,
    showFIRlines: true,
    showAPPlines: false,
    showOnlineATC: true,
    showNavaids: false,
    showNavaidsLabels: false,
};

const websiteInfo = {
    version: "DEV 0.1.5.0.1",
};

const localInfo = {};

document.getElementById("version").textContent = `v${websiteInfo.version}`;


const specialUsers = {
    "Tiaguinho_2009": [{
        "Role": "Main Developer",
        "DiscordNick": "tiaguinho_2009",
    }],
    "aaronandethan123": [{
        "Role": "Developer",
        "DiscordNick": "awdev_",
    }],
    "AvatarRoblox2018": [{
        "Role": "24SPY Helper",
        "DiscordNick": "noah_the_plane_guy",
    }],
    "BEANZBURGERBEANZ": [{
        "Role": "24SPY First User",
        "DiscordNick": "echogecko89",
    }],
    "frozenterror13": [{
        "Role": "Chart Maker",
        "DiscordNick": "aerosd",
    }],
    "EzyDubbs": [{
        "Role": "Chart Maker",
        "DiscordNick": "ezydubbs",
    }],
    "2316Nati": [{
        "Role": "Contributor",
        "DiscordNick": "bedsdrout",
    }],
};

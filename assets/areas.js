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
            ["TUGACHARTS", "https://drive.google.com/file/d/1ofmuravfpMXW1d4B9M43MyOGbc1RORCs/view"]
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
];

const settingsValues = {
    //default
    showAirportUI: true,
    showFIRlines: true,
    showAPPlines: false,
    showOnlineATC: true,
};

const websiteInfo = {
    version: "DEV 0.1.4.6.1",
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
};

import { BrandVariants, createDarkTheme, Theme } from '@fluentui/react-components';

const myNewTheme: BrandVariants = { 
    10: "#3a4936", 
    20: "#4c6247", 
    30: "#5f7b58", 
    40: "#73966a", // pressed
    50: "#88b17d", 
    60: "#9dce90", 
    70: "#b2eba4", // button color
    80: "#9dce90", // prev #bbedae (hover)
    90: "#c4f0b8",
    100: "#cdf2c2",
    110: "#d5f4cc",
    120: "#def6d6",
    130: "#e6f9e0",
    140: "#60D750",
    150: "#eefbeb",
    160: "#f7fdf5"
};

const darkTheme: Theme = {
    ...createDarkTheme(myNewTheme), 
    colorNeutralForeground1: "#e8e9e7", // Button text color
    colorNeutralBackground1Hover: "#f7fdf5", // Button color when hovered
    colorCompoundBrandBackgroundHover: "#d5f4cc", // Used by Checkbox when checked and hovered.
    colorCompoundBrandBackground: "#b2eba4", // Used by Checkbox when checked and pressed.
    colorBrandBackgroundHover: "#c4f0b8", // Used by Button background hover when appearance=primary and hovered.
    colorNeutralForegroundOnBrand: "#0c0c0c", // Used by Button text when appearance=primary.
    colorNeutralBackground1: "#0c0c0c", // Transparent button/field background color
    // colorNeutralForeground1Hover: "#353535", // Transparent button text color on hover
    "fontFamilyBase": "Roboto, Arial, Helvetica, sans-serif",
    "fontFamilyMonospace": "Roboto Mono, monospace",
    "fontFamilyNumeric": "Roboto, Arial, Helvetica, sans-serif",

};

export default darkTheme;


// const myNewTheme: BrandVariants = { 
//     10: "#598150", 
//     20: "#69985e", 
//     30: "#78ae6c", 
//     40: "#83bf76", 
//     50: "#8ecf80", 
//     60: "#96da87", 
//     70: "#9de58d", 
//     80: "#a3e794", 
//     90: "#a9e99b",
//     100: "#b6edaa",
//     110: "#c3f0b9",
//     120: "#d2f4ca",
//     130: "#e0f7db",
//     140: "#e7f9e4",
//     150: "#eefbec",
//     160: "#f5fdf3"
// };
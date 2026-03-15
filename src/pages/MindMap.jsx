import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translate, getLang, getDir } from "../context/LanguageContext";

const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const MAPS_EN = [
  {
    id: "boiler", icon: "\u{1F4A7}", title: "Hot Water Troubleshooting",
    centerColor: "#F59E0B", centerBg: "#FFFBEB",
    branches: [
      { label: "Step 1: Check for Hot Water", color: "#F97316", bg: "#FFF7ED",
        children: ["\u2705 Turn on hot tap \u2014 wait 2 minutes","\u274C No hot water at all \u2192 Go to Step 2","\u26A0\uFE0F Short burst then cold \u2192 Check thermostat (Step 3)"]},
      { label: "Step 2: Check Power Switch", color: "#10B981", bg: "#ECFDF5",
        children: ["\uD83D\uDD0C Electric boiler \u2192 Check breaker panel is ON","\u2600\uFE0F Solar heater \u2192 Cloudy day? Use electric backup switch","\uD83D\uDD25 Gas boiler \u2192 Check if pilot light is lit"]},
      { label: "Step 3: Check Thermostat", color: "#2563EB", bg: "#EEF2FF",
        children: ["\uD83C\uDF21\uFE0F Set temperature dial to 50-60\u00B0C minimum","\u23F0 Check timer/clock is set to correct time","\u23F3 Wait 30 minutes after adjusting before testing"]},
      { label: "Step 4: Water Pressure", color: "#8B5CF6", bg: "#F5F3FF",
        children: ["\uD83D\uDEBF Test water pressure at other taps","\uD83D\uDCC9 Weak from all taps? \u2192 Main valve may be partially closed","\uD83D\uDCCA Low pressure affects boiler \u2014 check filling loop"]},
      { label: "Step 5: When Did It Start?", color: "#EC4899", bg: "#FDF2F8",
        children: ["\uD83C\uDF24\uFE0F Sudden? Could be cloudy weather affecting solar heater","\uD83D\uDD28 Started after home repair? A pipe may have been affected","\uD83D\uDD04 Helps determine if temporary or real fault"]},
      { label: "Step 6: External Signs", color: "#EF4444", bg: "#FEF2F2",
        children: ["\u{1F4A7} Leaks near boiler \u2192 Call a plumber immediately","\uD83D\uDD0A Banging or whistling noises \u2192 Pressure/air issue","\uD83D\uDFE4 Rusty brown water \u2192 Tank may be corroded \u2192 Call pro!"]},
    ],
  },
  {
    id: "ac", icon: "\u2744\uFE0F", title: "Air Conditioner Problem",
    centerColor: "#0891B2", centerBg: "#ECFEFF",
    branches: [
      { label: "Step 1: Won\u2019t Turn On", color: "#F97316", bg: "#FFF7ED",
        children: ["\uD83D\uDD0C Check power supply \u2014 is it plugged in?","\uD83D\uDD0B Replace remote control batteries","\u26A1 Check breaker panel for AC circuit switch"]},
      { label: "Step 2: Not Cooling", color: "#10B981", bg: "#ECFDF5",
        children: ["\u2744\uFE0F Set mode to COOL (not FAN or DRY)","\uD83C\uDF21\uFE0F Set temperature at least 3\u00B0C below room temp","\uD83D\uDEAA Close all windows and doors in the room"]},
      { label: "Step 3: Clean Filters", color: "#2563EB", bg: "#EEF2FF",
        children: ["\uD83D\uDCCB Open front panel and pull out mesh filters","\uD83D\uDEBF Wash with water and mild soap","\u2600\uFE0F Let dry completely before reinstalling"]},
      { label: "Step 4: Water Leaks", color: "#8B5CF6", bg: "#F5F3FF",
        children: ["\uD83D\uDD27 Find and clear clogged drain pipe/hose","\uD83E\uDDCA Ice forming on pipes? \u2192 Likely needs gas refill","\uD83D\uDCD0 Check indoor unit is slightly tilted toward drain"]},
      { label: "Step 5: Strange Noises", color: "#F59E0B", bg: "#FFFBEB",
        children: ["\uD83D\uDD29 Rattling \u2192 Check for loose screws or panels","\uD83D\uDE37 Musty smell \u2192 Clean filters and evaporator coils","\uD83D\uDD27 Grinding/motor noise \u2192 Needs professional technician"]},
      { label: "\u26A0\uFE0F Call Professional", color: "#EF4444", bg: "#FEF2F2",
        children: ["\uD83D\uDD25 Sparks or burning smell \u2192 TURN OFF immediately!","\uD83D\uDD04 Problem persists after trying all steps above","\u26A1 Any electrical issue \u2192 Must use licensed technician"]},
    ],
  },
  {
    id: "electrical", icon: "\u26A1", title: "Electrical Short Circuit",
    centerColor: "#DC2626", centerBg: "#FEF2F2",
    branches: [
      { label: "Step 1: Identify Area", color: "#F97316", bg: "#FFF7ED",
        children: ["\uD83C\uDFE0 Is it the whole house or just one room?","\uD83D\uDD0D Find your electrical panel \u2014 which breaker tripped?","\uD83D\uDCA1 Check if neighbors have power too"]},
      { label: "Step 2: Check Breaker", color: "#10B981", bg: "#ECFDF5",
        children: ["\uD83D\uDD04 Reset breaker: Switch firmly OFF, then back ON","\u26A0\uFE0F Keeps tripping immediately? \u2192 Call electrician!","\u2705 Each breaker usually controls one room/area"]},
      { label: "Step 3: Unplug Devices", color: "#2563EB", bg: "#EEF2FF",
        children: ["\uD83D\uDD0C Unplug ALL devices in the affected area","1\uFE0F\u20E3 Plug them back ONE at a time and wait","\uD83D\uDD0D The device that causes a trip is the faulty one"]},
      { label: "Step 4: Check Outlets", color: "#8B5CF6", bg: "#F5F3FF",
        children: ["\uD83D\uDC40 Burn marks on any outlet? \u2192 Stop using & call pro!","\uD83D\uDD18 GFCI outlet (has buttons)? Press the RESET button","\uD83D\uDC43 Smell burning from outlet? \u2192 Don\u2019t use \u2014 call pro!"]},
      { label: "\u26A0\uFE0F Safety First!", color: "#EF4444", bg: "#FEF2F2",
        children: ["\uD83D\uDEAB NEVER touch exposed or damaged wires","\u{1F4A7} Never touch electrical panel with wet hands!","\u260E\uFE0F When in doubt \u2192 Always call a licensed electrician"]},
    ],
  },
  {
    id: "plumbing", icon: "\uD83D\uDEB0", title: "Plumbing Issues",
    centerColor: "#7C3AED", centerBg: "#F5F3FF",
    branches: [
      { label: "Clogged Drain", color: "#F97316", bg: "#FFF7ED",
        children: ["1\uFE0F\u20E3 Pour boiling water slowly down the drain","2\uFE0F\u20E3 Baking soda + vinegar \u2192 cover & wait 30 min","3\uFE0F\u20E3 Flush with hot water, then try plunger","4\uFE0F\u20E3 Still blocked? \u2192 Use a drain snake (\u20AA20-40)"]},
      { label: "Dripping Faucet", color: "#10B981", bg: "#ECFDF5",
        children: ["1\uFE0F\u20E3 Turn off water supply valves under the sink","2\uFE0F\u20E3 Remove faucet handle (screw usually under cap)","3\uFE0F\u20E3 Pull out cartridge \u2014 replace washer or O-ring","4\uFE0F\u20E3 Reassemble and turn water back on to test"]},
      { label: "Running Toilet", color: "#2563EB", bg: "#EEF2FF",
        children: ["1\uFE0F\u20E3 Remove tank lid and flush \u2014 watch what happens","2\uFE0F\u20E3 Flapper not sealing? \u2192 Replace it (\u20AA15-25)","3\uFE0F\u20E3 Water overflows tube? \u2192 Adjust the float lower","4\uFE0F\u20E3 Turn off water, swap part, turn back on & test"]},
      { label: "Pipe Leak", color: "#EF4444", bg: "#FEF2F2",
        children: ["\u{1F4A7} Small drip at connection \u2192 Tighten gently with wrench","\uD83D\uDD27 Wrap pipe threads with Teflon tape for better seal","\uD83D\uDEA8 Major leak / spray \u2192 SHUT MAIN WATER VALVE now!","\u260E\uFE0F Place towels/buckets \u2014 call plumber immediately"]},
    ],
  },
];

const MAPS_HE = [
  {
    id: "boiler", icon: "\u{1F4A7}", title: "\u05EA\u05E7\u05DC\u05D5\u05EA \u05DE\u05D9\u05DD \u05D7\u05DE\u05D9\u05DD",
    centerColor: "#F59E0B", centerBg: "#FFFBEB",
    branches: [
      { label: "\u05E9\u05DC\u05D1 1: \u05D1\u05D3\u05E7\u05D5 \u05DE\u05D9\u05DD \u05D7\u05DE\u05D9\u05DD", color: "#F97316", bg: "#FFF7ED",
        children: ["\u2705 \u05E4\u05EA\u05D7\u05D5 \u05D1\u05E8\u05D6 \u05D7\u05DD \u2014 \u05D7\u05DB\u05D5 2 \u05D3\u05E7\u05D5\u05EA","\u274C \u05D0\u05D9\u05DF \u05DE\u05D9\u05DD \u05D7\u05DE\u05D9\u05DD \u05D1\u05DB\u05DC\u05DC \u2192 \u05E2\u05D1\u05E8\u05D5 \u05DC\u05E9\u05DC\u05D1 2","\u26A0\uFE0F \u05D4\u05EA\u05E4\u05E8\u05E6\u05D5\u05EA \u05E7\u05E6\u05E8\u05D5\u05EA \u05D5\u05D0\u05D6 \u05E7\u05E8 \u2192 \u05D1\u05D3\u05E7\u05D5 \u05EA\u05E8\u05DE\u05D5\u05E1\u05D8\u05D8 (\u05E9\u05DC\u05D1 3)"]},
      { label: "\u05E9\u05DC\u05D1 2: \u05D1\u05D3\u05E7\u05D5 \u05D7\u05E9\u05DE\u05DC", color: "#10B981", bg: "#ECFDF5",
        children: ["\uD83D\uDD0C \u05D1\u05D5\u05D9\u05DC\u05E8 \u05D7\u05E9\u05DE\u05DC\u05D9 \u2192 \u05D1\u05D3\u05E7\u05D5 \u05E9\u05D4\u05DE\u05E4\u05E1\u05E7 \u05D3\u05DC\u05D5\u05E7","\u2600\uFE0F \u05D3\u05D5\u05D3 \u05E9\u05DE\u05E9 \u2192 \u05D9\u05D5\u05DD \u05DE\u05E2\u05D5\u05E0\u05DF? \u05D4\u05E4\u05E2\u05D9\u05DC\u05D5 \u05D2\u05D9\u05D1\u05D5\u05D9 \u05D7\u05E9\u05DE\u05DC\u05D9","\uD83D\uDD25 \u05D1\u05D5\u05D9\u05DC\u05E8 \u05D2\u05D6 \u2192 \u05D1\u05D3\u05E7\u05D5 \u05E9\u05D4\u05DC\u05D4\u05D1\u05D4 \u05D3\u05D5\u05DC\u05E7\u05EA"]},
      { label: "\u05E9\u05DC\u05D1 3: \u05D1\u05D3\u05E7\u05D5 \u05EA\u05E8\u05DE\u05D5\u05E1\u05D8\u05D8", color: "#2563EB", bg: "#EEF2FF",
        children: ["\uD83C\uDF21\uFE0F \u05DB\u05D5\u05D5\u05E0\u05D5 \u05D8\u05DE\u05E4\u05E8\u05D8\u05D5\u05E8\u05D4 \u05DC-50-60 \u05DE\u05E2\u05DC\u05D5\u05EA","\u23F0 \u05D1\u05D3\u05E7\u05D5 \u05E9\u05D4\u05D8\u05D9\u05D9\u05DE\u05E8 \u05DE\u05DB\u05D5\u05D5\u05DF \u05E0\u05DB\u05D5\u05DF","\u23F3 \u05D7\u05DB\u05D5 30 \u05D3\u05E7\u05D5\u05EA \u05D0\u05D7\u05E8\u05D9 \u05DB\u05D9\u05D5\u05D5\u05E0\u05D5\u05DF"]},
      { label: "\u05E9\u05DC\u05D1 4: \u05DC\u05D7\u05E5 \u05DE\u05D9\u05DD", color: "#8B5CF6", bg: "#F5F3FF",
        children: ["\uD83D\uDEBF \u05D1\u05D3\u05E7\u05D5 \u05DC\u05D7\u05E5 \u05DE\u05D9\u05DD \u05D1\u05D1\u05E8\u05D6\u05D9\u05DD \u05D0\u05D7\u05E8\u05D9\u05DD","\uD83D\uDCC9 \u05D7\u05DC\u05E9 \u05D1\u05DB\u05DC \u05D4\u05D1\u05E8\u05D6\u05D9\u05DD? \u2192 \u05D0\u05D5\u05DC\u05D9 \u05D4\u05E9\u05E1\u05EA\u05D5\u05DD \u05E1\u05D2\u05D5\u05E8 \u05D7\u05DC\u05E7\u05D9\u05EA","\uD83D\uDCCA \u05DC\u05D7\u05E5 \u05E0\u05DE\u05D5\u05DA \u05DE\u05E9\u05E4\u05D9\u05E2 \u05E2\u05DC \u05D4\u05D1\u05D5\u05D9\u05DC\u05E8"]},
      { label: "\u05E9\u05DC\u05D1 5: \u05DE\u05EA\u05D9 \u05D6\u05D4 \u05D4\u05EA\u05D7\u05D9\u05DC?", color: "#EC4899", bg: "#FDF2F8",
        children: ["\uD83C\uDF24\uFE0F \u05E4\u05EA\u05D0\u05D5\u05DD? \u05D0\u05D5\u05DC\u05D9 \u05DE\u05D6\u05D2 \u05D0\u05D5\u05D9\u05E8 \u05DE\u05E2\u05D5\u05E0\u05DF","\uD83D\uDD28 \u05D4\u05EA\u05D7\u05D9\u05DC \u05D0\u05D7\u05E8\u05D9 \u05EA\u05D9\u05E7\u05D5\u05DF? \u05D0\u05D5\u05DC\u05D9 \u05E6\u05D9\u05E0\u05D5\u05E8 \u05E0\u05E4\u05D2\u05E2","\uD83D\uDD04 \u05E2\u05D5\u05D6\u05E8 \u05DC\u05D4\u05D1\u05D9\u05DF \u05D0\u05DD \u05D6\u05D4 \u05D6\u05DE\u05E0\u05D9 \u05D0\u05D5 \u05EA\u05E7\u05DC\u05D4"]},
      { label: "\u05E9\u05DC\u05D1 6: \u05E1\u05D9\u05DE\u05E0\u05D9\u05DD \u05D7\u05D9\u05E6\u05D5\u05E0\u05D9\u05D9\u05DD", color: "#EF4444", bg: "#FEF2F2",
        children: ["\u{1F4A7} \u05E0\u05D6\u05D9\u05DC\u05D5\u05EA \u05DC\u05D9\u05D3 \u05D4\u05D1\u05D5\u05D9\u05DC\u05E8 \u2192 \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05E9\u05E8\u05D1\u05E8\u05D1!","\uD83D\uDD0A \u05E8\u05E2\u05E9\u05D9\u05DD \u05D0\u05D5 \u05E6\u05E4\u05D9\u05E8\u05D5\u05EA \u2192 \u05D1\u05E2\u05D9\u05D9\u05EA \u05DC\u05D7\u05E5/\u05D0\u05D5\u05D5\u05D9\u05E8","\uD83D\uDFE4 \u05DE\u05D9\u05DD \u05D7\u05D5\u05DE\u05D9\u05DD \u2192 \u05D4\u05DE\u05DB\u05DC \u05D7\u05DC\u05D5\u05D3 \u2192 \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05DE\u05E7\u05E6\u05D5\u05E2\u05DF!"]},
    ],
  },
  {
    id: "ac", icon: "\u2744\uFE0F", title: "\u05EA\u05E7\u05DC\u05D5\u05EA \u05DE\u05D6\u05D2\u05DF",
    centerColor: "#0891B2", centerBg: "#ECFEFF",
    branches: [
      { label: "\u05E9\u05DC\u05D1 1: \u05DC\u05D0 \u05E0\u05D3\u05DC\u05E7", color: "#F97316", bg: "#FFF7ED",
        children: ["\uD83D\uDD0C \u05D1\u05D3\u05E7\u05D5 \u05D7\u05D9\u05D1\u05D5\u05E8 \u05DC\u05D7\u05E9\u05DE\u05DC","\uD83D\uDD0B \u05D4\u05D7\u05DC\u05D9\u05E4\u05D5 \u05E1\u05D5\u05DC\u05DC\u05D5\u05EA \u05D1\u05E9\u05DC\u05D8","\u26A1 \u05D1\u05D3\u05E7\u05D5 \u05DE\u05E4\u05E1\u05E7 \u05D7\u05E9\u05DE\u05DC \u05DC\u05DE\u05D6\u05D2\u05DF"]},
      { label: "\u05E9\u05DC\u05D1 2: \u05DC\u05D0 \u05DE\u05E7\u05E8\u05E8", color: "#10B981", bg: "#ECFDF5",
        children: ["\u2744\uFE0F \u05D5\u05D3\u05D0\u05D5 \u05E9\u05D4\u05DE\u05E6\u05D1 \u05E2\u05DC COOL","\uD83C\uDF21\uFE0F \u05DB\u05D5\u05D5\u05E0\u05D5 \u05D8\u05DE\u05E4\u05E8\u05D8\u05D5\u05E8\u05D4 3 \u05DE\u05E2\u05DC\u05D5\u05EA \u05DE\u05EA\u05D7\u05EA \u05D4\u05D7\u05D3\u05E8","\uD83D\uDEAA \u05E1\u05D2\u05E8\u05D5 \u05D7\u05DC\u05D5\u05E0\u05D5\u05EA \u05D5\u05D3\u05DC\u05EA\u05D5\u05EA"]},
      { label: "\u05E9\u05DC\u05D1 3: \u05E0\u05D9\u05E7\u05D5\u05D9 \u05E4\u05D9\u05DC\u05D8\u05E8\u05D9\u05DD", color: "#2563EB", bg: "#EEF2FF",
        children: ["\uD83D\uDCCB \u05E4\u05EA\u05D7\u05D5 \u05DE\u05DB\u05E1\u05D4 \u05D5\u05D4\u05D5\u05E6\u05D9\u05D0\u05D5 \u05E4\u05D9\u05DC\u05D8\u05E8\u05D9\u05DD","\uD83D\uDEBF \u05E9\u05D8\u05E4\u05D5 \u05D1\u05DE\u05D9\u05DD \u05D5\u05E1\u05D1\u05D5\u05DF \u05E2\u05D3\u05D9\u05DF","\u2600\uFE0F \u05D9\u05D9\u05D1\u05E9\u05D5 \u05DC\u05D2\u05DE\u05E8\u05D9 \u05DC\u05E4\u05E0\u05D9 \u05D4\u05D7\u05D6\u05E8\u05D4"]},
      { label: "\u05E9\u05DC\u05D1 4: \u05E0\u05D6\u05D9\u05DC\u05EA \u05DE\u05D9\u05DD", color: "#8B5CF6", bg: "#F5F3FF",
        children: ["\uD83D\uDD27 \u05D0\u05EA\u05E8\u05D5 \u05D5\u05E0\u05E7\u05D5 \u05E6\u05D9\u05E0\u05D5\u05E8 \u05E0\u05D9\u05E7\u05D5\u05D6 \u05E1\u05EA\u05D5\u05DD","\uD83E\uDDCA \u05E7\u05E8\u05D7 \u05E2\u05DC \u05D4\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA? \u2192 \u05E6\u05E8\u05D9\u05DA \u05DE\u05D9\u05DC\u05D5\u05D9 \u05D2\u05D6","\uD83D\uDCD0 \u05D1\u05D3\u05E7\u05D5 \u05E9\u05D4\u05D9\u05D7\u05D9\u05D3\u05D4 \u05DE\u05D5\u05D8\u05D4 \u05DC\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05E0\u05D9\u05E7\u05D5\u05D6"]},
      { label: "\u05E9\u05DC\u05D1 5: \u05E8\u05E2\u05E9\u05D9\u05DD \u05DE\u05D5\u05D6\u05E8\u05D9\u05DD", color: "#F59E0B", bg: "#FFFBEB",
        children: ["\uD83D\uDD29 \u05E8\u05E2\u05E9 \u2192 \u05D1\u05D3\u05E7\u05D5 \u05D1\u05E8\u05D2\u05D9\u05DD \u05E8\u05D5\u05E4\u05E4\u05D9\u05DD","\uD83D\uDE37 \u05E8\u05D9\u05D7 \u05E8\u05E2 \u2192 \u05E0\u05E7\u05D5 \u05E4\u05D9\u05DC\u05D8\u05E8\u05D9\u05DD \u05D5\u05DE\u05D0\u05D9\u05D9\u05D3","\uD83D\uDD27 \u05E8\u05E2\u05E9 \u05DE\u05E0\u05D5\u05E2 \u2192 \u05E6\u05E8\u05D9\u05DA \u05D8\u05DB\u05E0\u05D0\u05D9"]},
      { label: "\u26A0\uFE0F \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05DE\u05E7\u05E6\u05D5\u05E2\u05DF", color: "#EF4444", bg: "#FEF2F2",
        children: ["\uD83D\uDD25 \u05E0\u05D9\u05E6\u05D5\u05E6\u05D5\u05EA \u05D0\u05D5 \u05E8\u05D9\u05D7 \u05E9\u05E8\u05D9\u05E4\u05D4 \u2192 \u05DB\u05D1\u05D5 \u05DE\u05D9\u05D3!","\uD83D\uDD04 \u05D4\u05D1\u05E2\u05D9\u05D4 \u05E0\u05DE\u05E9\u05DB\u05EA \u05D0\u05D7\u05E8\u05D9 \u05DB\u05DC \u05D4\u05E9\u05DC\u05D1\u05D9\u05DD","\u26A1 \u05DB\u05DC \u05D1\u05E2\u05D9\u05D4 \u05D7\u05E9\u05DE\u05DC\u05D9\u05EA \u2192 \u05D7\u05D5\u05D1\u05D4 \u05D8\u05DB\u05E0\u05D0\u05D9 \u05DE\u05D5\u05E1\u05DE\u05DA"]},
    ],
  },
  {
    id: "electrical", icon: "\u26A1", title: "\u05E7\u05E6\u05E8 \u05D7\u05E9\u05DE\u05DC\u05D9",
    centerColor: "#DC2626", centerBg: "#FEF2F2",
    branches: [
      { label: "\u05E9\u05DC\u05D1 1: \u05D0\u05EA\u05E8\u05D5 \u05D0\u05EA \u05D4\u05D0\u05D6\u05D5\u05E8", color: "#F97316", bg: "#FFF7ED",
        children: ["\uD83C\uDFE0 \u05DB\u05DC \u05D4\u05D1\u05D9\u05EA \u05D0\u05D5 \u05E8\u05E7 \u05D7\u05D3\u05E8 \u05D0\u05D7\u05D3?","\uD83D\uDD0D \u05DE\u05E6\u05D0\u05D5 \u05D0\u05EA \u05DC\u05D5\u05D7 \u05D4\u05D7\u05E9\u05DE\u05DC \u2014 \u05D0\u05D9\u05D6\u05D4 \u05DE\u05E4\u05E1\u05E7 \u05E0\u05E4\u05DC?","\uD83D\uDCA1 \u05D1\u05D3\u05E7\u05D5 \u05D0\u05DD \u05D2\u05DD \u05DC\u05E9\u05DB\u05E0\u05D9\u05DD \u05D0\u05D9\u05DF \u05D7\u05E9\u05DE\u05DC"]},
      { label: "\u05E9\u05DC\u05D1 2: \u05D1\u05D3\u05E7\u05D5 \u05DE\u05E4\u05E1\u05E7", color: "#10B981", bg: "#ECFDF5",
        children: ["\uD83D\uDD04 \u05D0\u05E4\u05E1\u05D5: \u05DB\u05D1\u05D5 \u05DC\u05D2\u05DE\u05E8\u05D9 \u05D5\u05D0\u05D6 \u05D4\u05D3\u05DC\u05D9\u05E7\u05D5 \u05DE\u05D7\u05D3\u05E9","\u26A0\uFE0F \u05E0\u05D5\u05E4\u05DC \u05E9\u05D5\u05D1 \u05DE\u05D9\u05D3? \u2192 \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05D7\u05E9\u05DE\u05DC\u05D0\u05D9!","\u2705 \u05DB\u05DC \u05DE\u05E4\u05E1\u05E7 \u05E9\u05D5\u05DC\u05D8 \u05E2\u05DC \u05D7\u05D3\u05E8 \u05D0\u05D7\u05D3"]},
      { label: "\u05E9\u05DC\u05D1 3: \u05E0\u05EA\u05E7\u05D5 \u05DE\u05DB\u05E9\u05D9\u05E8\u05D9\u05DD", color: "#2563EB", bg: "#EEF2FF",
        children: ["\uD83D\uDD0C \u05E0\u05EA\u05E7\u05D5 \u05D0\u05EA \u05DB\u05DC \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8\u05D9\u05DD \u05D1\u05D0\u05D6\u05D5\u05E8","1\uFE0F\u20E3 \u05D7\u05D1\u05E8\u05D5 \u05D7\u05D6\u05E8\u05D4 \u05D0\u05D7\u05D3 \u05D0\u05D7\u05D3 \u05D5\u05D7\u05DB\u05D5","\uD83D\uDD0D \u05D4\u05DE\u05DB\u05E9\u05D9\u05E8 \u05E9\u05D2\u05D5\u05E8\u05DD \u05DC\u05E0\u05E4\u05D9\u05DC\u05D4 \u05D4\u05D5\u05D0 \u05D4\u05EA\u05E7\u05D5\u05DC"]},
      { label: "\u05E9\u05DC\u05D1 4: \u05D1\u05D3\u05E7\u05D5 \u05E9\u05E7\u05E2\u05D9\u05DD", color: "#8B5CF6", bg: "#F5F3FF",
        children: ["\uD83D\uDC40 \u05E1\u05D9\u05DE\u05E0\u05D9 \u05E9\u05E8\u05D9\u05E4\u05D4 \u05E2\u05DC \u05E9\u05E7\u05E2? \u2192 \u05D4\u05E4\u05E1\u05D9\u05E7\u05D5 \u05E9\u05D9\u05DE\u05D5\u05E9!","\uD83D\uDD18 \u05E9\u05E7\u05E2 \u05E2\u05DD \u05DB\u05E4\u05EA\u05D5\u05E8\u05D9\u05DD? \u05DC\u05D7\u05E6\u05D5 RESET","\uD83D\uDC43 \u05E8\u05D9\u05D7 \u05E9\u05E8\u05D9\u05E4\u05D4 \u05DE\u05E9\u05E7\u05E2? \u2192 \u05D0\u05DC \u05EA\u05E9\u05EA\u05DE\u05E9\u05D5 \u2014 \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05DE\u05E7\u05E6\u05D5\u05E2\u05DF!"]},
      { label: "\u26A0\uFE0F \u05D1\u05D8\u05D9\u05D7\u05D5\u05EA \u05E7\u05D5\u05D3\u05DD!", color: "#EF4444", bg: "#FEF2F2",
        children: ["\uD83D\uDEAB \u05DC\u05E2\u05D5\u05DC\u05DD \u05D0\u05DC \u05EA\u05D9\u05D2\u05E2\u05D5 \u05D1\u05D7\u05D5\u05D8\u05D9\u05DD \u05D7\u05E9\u05D5\u05E4\u05D9\u05DD","\u{1F4A7} \u05DC\u05E2\u05D5\u05DC\u05DD \u05D0\u05DC \u05EA\u05D9\u05D2\u05E2\u05D5 \u05D1\u05DC\u05D5\u05D7 \u05D7\u05E9\u05DE\u05DC \u05E2\u05DD \u05D9\u05D3\u05D9\u05D9\u05DD \u05E8\u05D8\u05D5\u05D1\u05D5\u05EA!","\u260E\uFE0F \u05D1\u05E1\u05E4\u05E7? \u2192 \u05EA\u05DE\u05D9\u05D3 \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05D7\u05E9\u05DE\u05DC\u05D0\u05D9 \u05DE\u05D5\u05E1\u05DE\u05DA"]},
    ],
  },
  {
    id: "plumbing", icon: "\uD83D\uDEB0", title: "\u05EA\u05E7\u05DC\u05D5\u05EA \u05D0\u05D9\u05E0\u05E1\u05D8\u05DC\u05E6\u05D9\u05D4",
    centerColor: "#7C3AED", centerBg: "#F5F3FF",
    branches: [
      { label: "\u05E0\u05D9\u05E7\u05D5\u05D6 \u05E1\u05EA\u05D5\u05DD", color: "#F97316", bg: "#FFF7ED",
        children: ["1\uFE0F\u20E3 \u05E9\u05E4\u05DB\u05D5 \u05DE\u05D9\u05DD \u05E8\u05D5\u05EA\u05D7\u05D9\u05DD \u05DC\u05D0\u05D8 \u05DC\u05E0\u05D9\u05E7\u05D5\u05D6","2\uFE0F\u20E3 \u05E1\u05D5\u05D3\u05D4 + \u05D7\u05D5\u05DE\u05E5 \u2192 \u05DB\u05E1\u05D5 \u05D5\u05D7\u05DB\u05D5 30 \u05D3\u05E7\u05D5\u05EA","3\uFE0F\u20E3 \u05E9\u05D8\u05E4\u05D5 \u05E2\u05DD \u05DE\u05D9\u05DD \u05D7\u05DE\u05D9\u05DD, \u05E0\u05E1\u05D5 \u05E4\u05D5\u05DE\u05E4\u05D4","4\uFE0F\u20E3 \u05E2\u05D3\u05D9\u05D9\u05DF \u05E1\u05EA\u05D5\u05DD? \u2192 \u05E1\u05E4\u05D9\u05E8\u05DC\u05D4 (\u20AA20-40)"]},
      { label: "\u05D1\u05E8\u05D6 \u05DE\u05D8\u05E4\u05D8\u05E3", color: "#10B981", bg: "#ECFDF5",
        children: ["1\uFE0F\u20E3 \u05E1\u05D2\u05E8\u05D5 \u05D0\u05E1\u05E4\u05E7\u05EA \u05DE\u05D9\u05DD \u05DE\u05EA\u05D7\u05EA \u05D4\u05DB\u05D9\u05D5\u05E8","2\uFE0F\u20E3 \u05D4\u05E1\u05D9\u05E8\u05D5 \u05D9\u05D3\u05D9\u05EA (\u05D1\u05D5\u05E8\u05D2 \u05DE\u05EA\u05D7\u05EA \u05DB\u05D9\u05E1\u05D5\u05D9)","3\uFE0F\u20E3 \u05D4\u05D5\u05E6\u05D9\u05D0\u05D5 \u05E7\u05E8\u05D8\u05E8\u05D9\u05D3\u05D2 \u2014 \u05D4\u05D7\u05DC\u05D9\u05E4\u05D5 \u05D0\u05D8\u05DD \u05D0\u05D5 O-ring","4\uFE0F\u20E3 \u05D4\u05E8\u05DB\u05D9\u05D1\u05D5 \u05D5\u05E4\u05EA\u05D7\u05D5 \u05DE\u05D9\u05DD \u05DC\u05D1\u05D3\u05D9\u05E7\u05D4"]},
      { label: "\u05D0\u05E1\u05DC\u05D4 \u05D3\u05D5\u05DC\u05E4\u05EA", color: "#2563EB", bg: "#EEF2FF",
        children: ["1\uFE0F\u20E3 \u05D4\u05E1\u05D9\u05E8\u05D5 \u05DE\u05DB\u05E1\u05D4 \u05D5\u05D4\u05E8\u05D9\u05DE\u05D5 \u2014 \u05E6\u05E4\u05D5 \u05DE\u05D4 \u05E7\u05D5\u05E8\u05D4","2\uFE0F\u20E3 \u05D4\u05E9\u05E1\u05EA\u05D5\u05DD \u05DC\u05D0 \u05D0\u05D5\u05D8\u05DD? \u2192 \u05D4\u05D7\u05DC\u05D9\u05E4\u05D5 (\u20AA15-25)","3\uFE0F\u20E3 \u05DE\u05D9\u05DD \u05E2\u05D5\u05DC\u05D9\u05DD \u05DE\u05D4\u05E6\u05D9\u05E0\u05D5\u05E8? \u2192 \u05D4\u05D5\u05E8\u05D9\u05D3\u05D5 \u05D0\u05EA \u05D4\u05DE\u05E6\u05D5\u05E3","4\uFE0F\u20E3 \u05E1\u05D2\u05E8\u05D5 \u05DE\u05D9\u05DD, \u05D4\u05D7\u05DC\u05D9\u05E4\u05D5, \u05E4\u05EA\u05D7\u05D5 \u05D5\u05D1\u05D3\u05E7\u05D5"]},
      { label: "\u05E0\u05D6\u05D9\u05DC\u05EA \u05E6\u05D9\u05E0\u05D5\u05E8", color: "#EF4444", bg: "#FEF2F2",
        children: ["\u{1F4A7} \u05D8\u05E4\u05D8\u05D5\u05E3 \u05D1\u05D7\u05D9\u05D1\u05D5\u05E8 \u2192 \u05D4\u05D3\u05E7\u05D5 \u05D1\u05E2\u05D3\u05D9\u05E0\u05D5\u05EA \u05E2\u05DD \u05DE\u05E4\u05EA\u05D7","\uD83D\uDD27 \u05E2\u05D8\u05E4\u05D5 \u05D7\u05D5\u05D8\u05D9\u05DD \u05D1\u05D8\u05E4\u05DC\u05D5\u05DF \u05DC\u05D0\u05D9\u05D8\u05D5\u05DD","\uD83D\uDEA8 \u05E0\u05D6\u05D9\u05DC\u05D4 \u05D2\u05D3\u05D5\u05DC\u05D4 \u2192 \u05E1\u05D2\u05E8\u05D5 \u05D1\u05E8\u05D6 \u05E8\u05D0\u05E9\u05D9 \u05DE\u05D9\u05D3!","\u260E\uFE0F \u05E9\u05D9\u05DE\u05D5 \u05DE\u05D2\u05D1\u05D5\u05EA \u2014 \u05D4\u05D6\u05DE\u05D9\u05E0\u05D5 \u05E9\u05E8\u05D1\u05E8\u05D1 \u05DE\u05D9\u05D3"]},
    ],
  },
];

function getMaps() {
  var curLang = "en"; try { curLang = localStorage.getItem("fixmate_lang") || "en"; } catch(e) {}
  return curLang === "he" ? MAPS_HE : MAPS_EN;
}

/* ============= MIND MAP VISUAL ============= */
function MindMapView({ map }) {
  const [openBranch, setOpenBranch] = useState(null);
  const lang = getLang();
  const isHe = lang === "he";
  const cx = 400, cy = 300, R = 200;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 860, margin: "0 auto", minHeight: 620, padding: "30px 10px" }}>
      {/* Center node */}
      <div style={{
        position: "absolute", left: "50%", top: 240, transform: "translate(-50%,-50%)",
        width: 120, height: 120, borderRadius: "50%",
        background: `linear-gradient(135deg,${map.centerBg},#FFF)`,
        border: `3px solid ${map.centerColor}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 32px ${map.centerColor}30`, zIndex: 10,
      }}>
        <span style={{ fontSize: 36 }}>{map.icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: map.centerColor, textAlign: "center", lineHeight: 1.2, padding: "0 8px", marginTop: 4 }}>{map.title}</span>
      </div>

      {/* Branches */}
      {map.branches.map((branch, i) => {
        const angle = (i / map.branches.length) * Math.PI * 2 - Math.PI / 2;
        const bx = cx + R * Math.cos(angle);
        const by = cy + R * Math.sin(angle);
        const isOpen = openBranch === i;

        return (
          <div key={i}>
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 600, pointerEvents: "none", zIndex: 1 }}>
              <line x1="50%" y1={240} x2={`${(bx / 800) * 100}%`} y2={by} stroke={branch.color} strokeWidth="2" strokeDasharray="6,4" opacity={0.4} />
            </svg>

            <div
              onClick={() => setOpenBranch(isOpen ? null : i)}
              style={{
                position: "absolute",
                left: `${(bx / 800) * 100}%`, top: by,
                transform: "translate(-50%,-50%)",
                background: isOpen ? branch.color : branch.bg,
                color: isOpen ? "#FFF" : branch.color,
                border: `2px solid ${branch.color}`,
                borderRadius: 16, padding: "12px 18px",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer", zIndex: 5,
                boxShadow: isOpen ? `0 6px 24px ${branch.color}40` : `0 2px 12px ${branch.color}20`,
                transition: "all 0.3s",
                maxWidth: 180, textAlign: "center",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {branch.label}
            </div>

            {isOpen && (
              <div style={{
                position: "absolute",
                left: `${(bx / 800) * 100}%`, top: by + 36,
                transform: "translateX(-50%)",
                background: "#FFF", border: `2px solid ${branch.color}`,
                borderRadius: 18, padding: "16px 18px",
                zIndex: 20, minWidth: 260, maxWidth: 340,
                boxShadow: `0 12px 40px ${branch.color}25`,
                animation: "fadeUp .3s",
              }}>
                {branch.children.map((child, ci) => (
                  <div key={ci} style={{
                    fontSize: 13, color: "#1A2B4A", lineHeight: 1.6,
                    padding: "6px 0",
                    borderBottom: ci < branch.children.length - 1 ? "1px solid #F0F4FF" : "none",
                  }}>
                    {child}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============= MAIN ============= */
export default function MindMap() {
  const navigate = useNavigate();
  var lang = getLang(); var dir = getDir();
  const isHe = lang === "he";
  const [selectedMap, setSelectedMap] = useState(null);
  var MAPS = getMaps();
  const map = MAPS.find((m) => m.id === selectedMap);

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", background: "linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 50%,#FFF 100%)", minHeight: "100vh", direction: dir }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .mmCard:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08)!important}
        *{box-sizing:border-box;margin:0}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E8ECF4", boxShadow: "0 1px 12px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <span style={{ fontFamily: isHe ? "'Heebo','Outfit'" : "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A", display: "block" }}>
              {selectedMap ? map.title : (isHe ? "\u05DE\u05E4\u05EA \u05D7\u05E9\u05D9\u05D1\u05D4" : "Mind Map")}
            </span>
            <span style={{ fontSize: 12, color: "#7C8DB5" }}>
              {selectedMap ? (isHe ? "\u05DC\u05D7\u05E6\u05D5 \u05E2\u05DC \u05E9\u05DC\u05D1 \u05DC\u05E4\u05E8\u05D8\u05D9\u05DD" : "Tap any step to see details") : (isHe ? "\u05DE\u05D3\u05E8\u05D9\u05DB\u05D9 \u05E4\u05EA\u05E8\u05D5\u05DF \u05EA\u05E7\u05DC\u05D5\u05EA" : "Troubleshooting Guides")}
            </span>
          </div>
          <button onClick={() => selectedMap ? setSelectedMap(null) : navigate("/client/dashboard")} style={{
            width: 44, height: 44, borderRadius: 14, background: "#F0F4FF", border: "1px solid #E2E8F0",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6B8A", cursor: "pointer",
          }}><IconBack /></button>
        </div>
      </nav>

      {/* MAP VIEW */}
      {selectedMap && map ? (
        <MindMapView map={map} />
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 56 }}>{"\uD83D\uDDFA\uFE0F"}</span>
            <h1 style={{ fontFamily: isHe ? "'Heebo','Outfit'" : "'Outfit'", fontSize: 28, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>{isHe ? "\u05DE\u05D3\u05E8\u05D9\u05DB\u05D9 \u05DE\u05E4\u05EA \u05D7\u05E9\u05D9\u05D1\u05D4" : "Mind Map Guides"}</h1>
            <p style={{ fontSize: 15, color: "#7C8DB5" }}>{isHe ? "\u05E4\u05EA\u05E8\u05D5\u05DF \u05EA\u05E7\u05DC\u05D5\u05EA \u05D5\u05D9\u05D6\u05D5\u05D0\u05DC\u05D9 \u2014 \u05DC\u05D7\u05E6\u05D5 \u05E2\u05DC \u05E2\u05E0\u05E3 \u05DC\u05E8\u05D0\u05D5\u05EA \u05E9\u05DC\u05D1\u05D9\u05DD" : "Visual troubleshooting \u2014 tap branches to see step-by-step fixes"}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
            {MAPS.map((m) => (
              <div key={m.id} className="mmCard" onClick={() => setSelectedMap(m.id)}
                style={{
                  background: "#FFF", borderRadius: 22, padding: "28px 20px", textAlign: "center",
                  border: "1px solid #E8ECF4", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,.04)", transition: "all 0.3s",
                }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: `${m.centerColor}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 28,
                }}>{m.icon}</div>
                <div style={{ fontFamily: isHe ? "'Heebo','Outfit'" : "'Outfit'", fontSize: 16, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 14 }}>{m.branches.length} {isHe ? "\u05E9\u05DC\u05D1\u05D9\u05DD" : "steps"}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: m.centerColor }}>{isHe ? "\u05E4\u05EA\u05D7\u05D5 \u05DE\u05E4\u05D4 \u2190" : "Open Map \u2192"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
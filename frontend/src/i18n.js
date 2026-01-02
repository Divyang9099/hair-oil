import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "benefits": "Benefits",
                "about": "About Us",
                "order": "Order Now"
            },
            "hero": {
                "title": "Kesh Rasayana: 20 Years of Experience, Ambala's Herbal Legacy",
                "subtitle": "Ayurvedic treatment for hair fall, dandruff, and baldness.",
                "button": "Order Now"
            },
            "benefits": {
                "title": "Benefits of Kesh Rasayana",
                "stop_fall": "Stops Hair Fall",
                "stop_fall_desc": "Natural herbs like Bhringraj and Amla strengthen hair roots and significantly reduce hair fall.",
                "regrowth": "Promotes Regrowth",
                "regrowth_desc": "Oil massage increases blood circulation, stimulating new and healthy hair growth.",
                "dandruff": "Removes Dandruff",
                "dandruff_desc": "Anti-bacterial Neem and Camphor cleanse the scalp and eliminate dandruff and itchiness.",
                "graying": "Prevents Graying",
                "graying_desc": "Natural nutrition reduces the problem of hair turning white at an early age.",
                "shine": "Natural Shine",
                "shine_desc": "Conditions hair from within, making it silky and shiny without chemicals.",
                "peace": "Better Sleep",
                "peace_desc": "Massaging reduces stress, keeps the mind calm, and ensures deep sleep.",
                "split_ends": "No Split Ends",
                "split_ends_desc": "Proper moisture prevents breakage and solves the problem of split ends.",
                "show_more": "Show All Benefits",
                "show_less": "Show Less"
            },
            "order": {
                "title": "Place Your Order",
                "name": "Full Name",
                "phone": "Mobile Number",
                "address": "Full Address",
                "size": "Bottle Size",
                "quantity": "Quantity",
                "price": "Price",
                "total": "Total",
                "confirm": "Confirm Order",
                "success": "Order Saved! ✅",
                "message": "✅ Thank you! Your order has been received.",
                "connecting": "Connecting to server...",
                "processing": "Processing...",
                "phone_error": "Please enter a valid mobile number.\nMobile number should be 10 digits and start with 6, 7, 8, or 9.\nExample: 9876543210"
            },
            "about": {
                "title": "20 Years of Purity and Trust",
                "desc": "Kesh Rasayana is not just a product, it is the legacy of our family's 20 years of hard work and tradition. Prepared by experienced vaidyas of Ambala, this oil is made with 100% pure Ayurvedic ingredients.",
                "video_title": "Watch! The process of making pure oil",
                "video_error": "Please enter a valid YouTube or Vimeo URL."
            },
            "lead": {
                "title": "Enter Your Details",
                "subtitle": "Please enter your mobile number and email to proceed with the order.",
                "email_placeholder": "Your Email",
                "phone_placeholder": "Your Mobile Number",
                "email_error": "Please enter a valid email.",
                "phone_error": "Please enter a valid mobile number (10 digits).",
                "cancel": "Cancel",
                "submit": "Continue",
                "processing": "Processing...",
                "server_error": "No connection to server: {{message}}",
                "save_error": "Error saving information. Please try again."
            },
            "footer": {
                "contact": "Contact Us",
                "phone_label": "Phone",
                "website_label": "Website",
                "quick_links": "Quick Links",
                "about_title": "About Us",
                "about_desc": "Vaidya of Ambala's legacy, making pure Ayurvedic hair oil for 20 years.",
                "rights": "All rights reserved.",
                "admin": "Admin"
            }
        }
    },
    gu: {
        translation: {
            "nav": {
                "home": "મુખ્ય પેજ",
                "benefits": "ફાયદાઓ",
                "about": "અમારા વિશે",
                "order": "ઓર્ડર કરો"
            },
            "hero": {
                "title": "Kesh Rasayana: ૨૦ વર્ષનો અનુભવ, અંબાલાની ઔષધીઓનો વારસો",
                "subtitle": "ખરતા વાળ, ખોડો, અને ઉંદરી જેવી સમસ્યાઓ માટે આયુર્વેદિક ઉપચાર.",
                "button": "હમણાં જ ઓર્ડર કરો"
            },
            "benefits": {
                "title": "Kesh Rasayana ના ફાયદાઓ",
                "stop_fall": "વાળ ખરતા અટકાવે છે",
                "stop_fall_desc": "આયુર્વેદિક તેલમાં રહેલા ભૃંગરાજ અને આમળા જેવા તત્વો વાળના મૂળને મજબૂત બનાવે છે.",
                "regrowth": "નવા વાળ ઉગાડવામાં મદદરૂપ",
                "regrowth_desc": "તેલથી માલિશ કરવાથી રક્ત પરિભ્રમણ વધે છે, જે નવા વાળ ઉગાડવામાં મદદ કરે છે.",
                "dandruff": "ખોડો દૂર કરે છે",
                "dandruff_desc": "લીમડો અને કપૂર જેવા તત્વો ખોપરીને સાફ રાખે છે અને ખોડો તેમજ ખંજવાળ દૂર કરે છે.",
                "graying": "સફેદ થતા વાળ અટકાવે છે",
                "graying_desc": "કુદરતી પોષણ આપે છે, જેનાથી નાની ઉંમરમાં વાળ સફેદ થવાની સમસ્યા ઓછી થાય છે.",
                "shine": "વાળને કુદરતી ચમક આપે છે",
                "shine_desc": "તેલ વાળને અંદરથી કન્ડિશનિંગ કરે છે, જેનાથી વાળ રેશમી અને ચમકદાર બને છે.",
                "peace": "માનસિક શાંતિ અને સારી ઊંઘ",
                "peace_desc": "માલિશ કરવાથી મગજ શાંત રહે છે, તણાવ ઓછો થાય છે અને સારી ઊંઘ આવે છે.",
                "split_ends": "બે મોઢાવાળા વાળમાં રાહત",
                "split_ends_desc": "વાળને પૂરતું મોઈશ્ચર મળવાથી વાળ વચ્ચેથી તૂટતા નથી અને સમસ્યા ઉકેલાય છે.",
                "show_more": "બધા ફાયદાઓ જુઓ",
                "show_less": "ઓછા બતાવો"
            },
            "order": {
                "title": "ઓર્ડર કરો",
                "name": "પૂરું નામ",
                "phone": "મોબાઇલ નંબર",
                "address": "પૂરું સરનામું",
                "size": "બોટલ સાઈઝ",
                "quantity": "જથ્થો",
                "price": "કિંમત",
                "total": "કુલ કિંમત",
                "confirm": "ઓર્ડર કન્ફર્મ કરો",
                "success": "ઓર્ડર સેવ થયો! ✅",
                "message": "✅ ધન્યવાદ! તમારો ઓર્ડર પ્રાપ્ત થયો છે.",
                "connecting": "સર્વર સાથે કનેક્ટ થઈ રહ્યું છે...",
                "processing": "પ્રક્રિયા ચાલી રહી છે...",
                "phone_error": "કૃપા કરીને માન્ય મોબાઇલ નંબર દાખલ કરો.\nમોબાઇલ નંબર 10 અંકનો હોવો જોઈએ અને 6, 7, 8 અથવા 9 થી શરૂ થવો જોઈએ.\nઉદાહરણ: 9876543210"
            },
            "about": {
                "title": "૨૦ વર્ષની શુદ્ધતા અને વિશ્વાસ",
                "desc": "Kesh Rasayana માત્ર એક પ્રોડક્ટ નથી, તે અમારા પરિવારની ૨૦ વર્ષની મહેનત અને પરંપરાનો વારસો છે. અંબાલાના અનુભવી વૈદ્ય દ્વારા તૈયાર કરવામાં આવેલું આ તેલ શુદ્ધ આયુર્વેદિક ઘટકો સાથે બનાવવામાં આવે છે.",
                "video_title": "જુઓ! શુદ્ધ તેલ બનાવવાની પ્રક્રિયા",
                "video_error": "કૃપા કરીને માન્ય YouTube અથવા Vimeo URL દાખલ કરો."
            },
            "lead": {
                "title": "તમારી વિગતો જણાવો",
                "subtitle": "ઓર્ડર કરવા માટે કૃપા કરીને તમારો મોબાઈલ નંબર અને ઇમેઇલ દાખલ કરો.",
                "email_placeholder": "તમારો ઇમેઇલ (Email)",
                "phone_placeholder": "તમારો મોબાઈલ નંબર",
                "email_error": "કૃપા કરીને માન્ય ઇમેઇલ દાખલ કરો.",
                "phone_error": "કૃપા કરીને માન્ય મોબાઈલ નંબર દાખલ કરો (૧૦ અંક).",
                "cancel": "રદ કરો",
                "submit": "આગળ વધો",
                "processing": "પ્રોસેસિંગ...",
                "server_error": "સર્વર સાથે કનેક્શન નથી: {{message}}",
                "save_error": "માહિતી સેવ કરવામાં ભૂલ આવી. ફરી પ્રયાસ કરો."
            },
            "footer": {
                "contact": "સંપર્ક કરો",
                "phone_label": "ફોન",
                "website_label": "વેબસાઈટ",
                "quick_links": "ઝડપી લિંક્સ",
                "about_title": "અમારા વિશે",
                "about_desc": "૨૦ વર્ષથી શુદ્ધ આયુર્વેદિક હેર ઓઇલ બનાવતા અંબાલાના વારસાના વૈદ્ય.",
                "rights": "બધા અધિકારો સુરક્ષિત.",
                "admin": "એડમિન"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'gu',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;

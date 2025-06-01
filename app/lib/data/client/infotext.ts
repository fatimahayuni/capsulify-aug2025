export async function getInfoText(id: string): Promise<string> {
    const data = {
        'INFO1': 'An essential in a capsule wardrobe that can be matched with lots of outfits. Can be layered underneath dresses, taking you from summer to winter. Ensure that you do not select anything too bulky that could make it hard to layer.',

        'INFO2': 'An essential in a capsule wardrobe that can be matched with lots of outfits. Can be layered underneath dresses, taking you from summer to winter. Ensure that you do not select anything too bulky that could make it hard to layer.',

        'INFO3': 'A top in a color that keeps your wardrobe interesting. This colorful top could fall under the 20% of your wadrobe that is fun and funky.',

        'INFO4': 'Top that you can throw on with your shorts or denim skirt to skip down to the shop for your Sudnday paper, or wear underneath a blazer on a Monday at work.',

        'INFO5': 'Top that you can throw on with your shorts or denim skirt to skip down to the shop for your Sudnday paper, or wear underneath a blazer on a Monday at work.',

        'INFO6': "Blouse in dressier fabric like satin, silk, chiffon, georgette, lace, etc. It will dress up any pair of shorts, jeans, or casual skirt. It'll also go the distance when it comes to work wear as well. Select one that can be worn tucked or untucked. It should also sit well when you throw on a blazer or a lightweight jacket.",

        'INFO7': "Smartly tailored dark pants in dressier fabric to take from work to evening. The default color is black but you may also choose grey or navy if you don't like black.",

        'INFO8': "Smartly tailored LIGHT pants in dressier fabric to take from work to evening. Could be in stone, cream, off-white, pale gray or a very light brown, whatever appeals to you most. Choose a slightly more casual fabric than the dark tailored pants. Play with texture.",

        'INFO9': "Could be in gray, brown, taupe/khaki. This can be worn very casually and great option for in-between seasonal weather, casual activities and running around.",

        'INFO10': "Dark jeans are easier to dress up as opposed to a light was jeans, which can sometimes be too casual.",
        
        'INFO11': "A skirt that can be dressed up for work and then to a more formal evening out. Look for some kind of detail to the skirt to make it less office-like for more versatility.",

        'INFO12':"A skirt that you can wear during the summer for a BBQ or pinic. Keep it simple for maximum versatility. As your shape suits A-line or mermaid, stay away from denim skirt. Opt for softer drape like satin, silk, and other softer dressy fabrics.",

        'INFO13':"Perfect for hot weather. Pick a stone, cream or dusty pink over black. If you don't like your knees or legs, select a pair of long shorts (just past the knee).",

        'INFO14': "Office or work appropriate style that can be brought from work to glam.",

        'INFO15': "Casual dress for weekend outings. Go for small, repetitive prints and low in color contrast. Patterns mean many different colors in the print therefore easier to match with various colors and accessories. Block color is fine too but nothing too bold as it will be harder to match.",

        'INFO16': "A piece that can take you from the boardroom with a black tailored skirt to Friday evening for casual outing worn with jeans. No more than 3 buttons as this is too formal. Choose one that tapers at your waist and back and fitted around the arms. It should look good open and buttoned. Go for details like ruched sleeves, slight peplum or ruffle will help make it look smart and less formal.",

        'INFO17': "Three-quarter or shorter sleeve for more modern look. Also look for a wide-open scoop neck or V-neck. Ideally fitted and not too long.",

        'INFO18': "A casual jacket should be lightweight, not too long (the shorter it is, the easier it'll be to wear with shorts or skirts). The color should be versatile, such as olive, blue denim, or dusty gold.",

        'INFO19': "A classic staple that seems to defy trends. They are versatile with skirts, dresses, pants or jeans.",

        'INFO20': "Heels as high or low as you're comfortable with. If you can't wear heels, select a wedge heel instead.",

        'INFO21': "The sexy heels are open, strappy and sandal-style. It is the go-to par for nights out. They should look great peeking out from under pants and jeans and are crucual for the little black dress.",

        'INFO22': "Choose a dressy pair of flat sandals in a metallic gold or silver. They will take you from sand to Saturday night in a flash.",

        'INFO23': "Your summer go-to for casual lunches, drinks under the stars and the office.",

        'INFO24': "For nights out. Complements black shoes.",

        'INFO25': "Complements black shoes.",

        'INFO26': "Complements beige shoes.",
    }

    return data[id as keyof typeof data]
}
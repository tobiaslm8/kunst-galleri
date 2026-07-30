import type { Artist } from "@/lib/types";

export const artists: Artist[] = [
  {
    name: "Kunstner 1",
    slug: "kunstner-1",
    role: "Malerier, stoflige lag og afdæmpede farver",
    portraitSrc: "/artists/kunstner-1/portrait.jpg",
    shortDescription:
      "Arbejder med rolige kompositioner, taktile overflader og et sanseligt møde mellem lys, skygge og farve.",
    intro: [
      "Kunstner 1 arbejder i et undersøgende felt mellem abstraktion, naturstudier og stille observationer.",
      "Værkerne bygges op i lag, hvor farver, spor og teksturer får lov til at stå tydeligt frem.",
      "Motiverne kredser om landskabets rytmer, materialets modstand og de små forskydninger i lyset.",
      "Udtrykket er afdæmpet og poetisk med en tydelig sans for balance, pause og nærvær."
    ],
    metaDescription:
      "Oplev Kunstner 1s malerier med rolige farveflader, stoflige lag og et minimalistisk billedsprog."
  },
  {
    name: "Kunstner 2",
    slug: "kunstner-2",
    role: "Ekspressive farvefelter og moderne formstudier",
    portraitSrc: "/artists/kunstner-2/portrait.jpg",
    shortDescription:
      "Skaber dynamiske værker med grafiske former, energi og farvekontraster, der giver rummet karakter.",
    intro: [
      "Kunstner 2 arbejder med kraftfulde farver, grafiske spor og en tydelig fornemmelse for bevægelse.",
      "De enkelte malerier fremstår som visuelle kompositioner, hvor linjer, flader og rytmer mødes.",
      "Inspirationen hentes fra byrum, musik, arkitektur og den spontane energi i det daglige liv.",
      "Processen er intuitiv, men kontrolleret, og hvert værk balancerer mellem frihed og struktur."
    ],
    metaDescription:
      "Se Kunstner 2s moderne malerier med ekspressive farver, grafiske former og dynamiske kompositioner."
  },
  {
    name: "Kunstner 3",
    slug: "kunstner-3",
    role: "Stille motiver, organiske former og nordisk lys",
    portraitSrc: "/artists/kunstner-3/portrait.jpg",
    shortDescription:
      "Forener organiske former, nordisk lys og en nænsom materialitet i stemningsfulde kunstværker.",
    intro: [
      "Kunstner 3s praksis tager afsæt i naturens former, skiftende årstider og det nordiske lys.",
      "Malerierne har et stille udtryk, hvor bløde overgange og organiske strukturer skaber dybde.",
      "Der arbejdes med en nænsom materialitet, som giver overfladerne en levende og meditativ karakter.",
      "Værkerne placerer sig mellem det genkendelige og det abstrakte og efterlader plads til fortolkning."
    ],
    metaDescription:
      "Gå på opdagelse i Kunstner 3s rolige kunstværker med organiske former, nordisk lys og sanselige detaljer."
  }
];

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

import type { Artist } from "@/lib/types";

export const artists: Artist[] = [
  {
    name: "Kunstner 1",
    slug: "kunstner-1",
    role: "Malerier, stoflige lag og afd\u00e6mpede farver",
    portraitSrc: "/artists/kunstner-1/portrait.jpg",
    shortDescription:
      "Arbejder med rolige kompositioner, taktile overflader og et sanseligt m\u00f8de mellem lys, skygge og farve.",
    intro: [
      "Kunstner 1 arbejder i et unders\u00f8gende felt mellem abstraktion, naturstudier og stille observationer.",
      "V\u00e6rkerne bygges op i lag, hvor farver, spor og teksturer f\u00e5r lov til at st\u00e5 tydeligt frem.",
      "Motiverne kredser om landskabets rytmer, materialets modstand og de sm\u00e5 forskydninger i lyset.",
      "Udtrykket er afd\u00e6mpet og poetisk med en tydelig sans for balance, pause og n\u00e6rv\u00e6r.",
      "Hvert billede inviterer beskueren til at g\u00e5 t\u00e6ttere p\u00e5 og opdage nye detaljer over tid."
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
      "Skaber dynamiske v\u00e6rker med grafiske former, energi og farvekontraster, der giver rummet karakter.",
    intro: [
      "Kunstner 2 arbejder med kraftfulde farver, grafiske spor og en tydelig fornemmelse for bev\u00e6gelse.",
      "De enkelte malerier fremst\u00e5r som visuelle kompositioner, hvor linjer, flader og rytmer m\u00f8des.",
      "Inspirationen hentes fra byrum, musik, arkitektur og den spontane energi i det daglige liv.",
      "Processen er intuitiv, men kontrolleret, og hvert v\u00e6rk balancerer mellem frihed og struktur.",
      "Resultatet er kunst med n\u00e6rv\u00e6r, temperament og et markant moderne udtryk."
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
      "Forener organiske former, nordisk lys og en n\u00e6nsom materialitet i stemningsfulde kunstv\u00e6rker.",
    intro: [
      "Kunstner 3s praksis tager afs\u00e6t i naturens former, skiftende \u00e5rstider og det nordiske lys.",
      "Malerierne har et stille udtryk, hvor bl\u00f8de overgange og organiske strukturer skaber dybde.",
      "Der arbejdes med en n\u00e6nsom materialitet, som giver overfladerne en levende og n\u00e6sten meditativ karakter.",
      "V\u00e6rkerne placerer sig mellem det genkendelige og det abstrakte og efterlader plads til fortolkning.",
      "Helhedsindtrykket er roligt, sanseligt og velegnet til rum, hvor kunsten gerne m\u00e5 skabe fordybelse."
    ],
    metaDescription:
      "G\u00e5 p\u00e5 opdagelse i Kunstner 3s rolige kunstv\u00e6rker med organiske former, nordisk lys og sanselige detaljer."
  }
];

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

# Råvarekalender

Et værktøj til at finde sæsonbestemte råvarer og blive bedre til at vælge ingredienser baseret på årstiden.

## Datakilder

- [Arla Råvarekalender](https://www.arla.dk/opskrifter/ravarekalender/)

## Installation

Kræver Node.js. Se [Arch Wiki](https://wiki.archlinux.org/title/Node.js) for installation.

## Brug

Scrape råvarer for en specifik måned:

```bash
node scrape.js <month>
```

**Eksempel:**

```bash
node scrape.js januar
```

## Formål

Dette projekt gør det nemt at finde ud af hvilke råvarer der er i sæson på et givet tidspunkt, så du kan:

- Vælge friske, lokale ingredienser
- Planlægge måltider efter sæson
- Få inspiration til madlavning baseret på tilgængelige råvarer

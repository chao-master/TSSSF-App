#TSSSF Card Generator Web App
(Twilight Sparkle's Secret Shipfic Folder)
A Fork of the web dependent [TSSSF-Generator](https://github.com/chao-master/TSSSFF-Generator)

##Using
A [live version](https://sucs.org/~ripp_/TSSSF-App/) can be found on my website.
The tool is mostly self explanitory but:
 * Click and type on each field to edit them.
 * Hover over (or tap if on mobile) the Icons to get to change them.
 * Card types can be changed by hovering the card type on the left of the card.
 * The card's image can be changed with the web or upload icon on the image. (Images from the web will only work if the site has CROS set up correctly, many don't)
 * Special symbols can be added with escapes such as \earth A full list is on the page.

Exported cards are pngs with additional data embeded which allow them to be reimported with the import option and edit them again.
If you wish to import these cards into other programs (maybe a TSSSF game) see the details on the export below

##Reporting bugs
  Bugs reports are handled via [github's issues system for the repo](https://github.com/chao-master/TSSSF-App/issues)

##Credits and thanks.
 * Majority of code is Written by Ripp_ AKA chao-master
 * Special thanks also go to
  * Coandco for helpful bug reports and
  * MrQuallzin For bug reports and helping with the pony power quick inserts.

## Forking
You are welcome to fork the project and run your own instance in terms with the LICENSE.
It would be nice if improvements are feed back into the main project with Pull requests but it is not necessary to do so.

## Export Format
Exported cards are regular png files with tEXt chunks storing the additional metadata
At current there is 8 tEXt blocks used:
 * cgv: The version, currentlly 0.1
 * name: The card's name
 * attr: The card's attributes (bar under image)
 * effect: The main card text
 * flavour: The card's flavour text
 * copyright: The card's copyright text
 * classes: Describes what the card is, it is a space seperated list of . prefixed words that describe the card:
   Some may exist even if the card is not the correct type.
    * Card type is determined by the presence of one of: .pony .start .goal .ship
    * Gender from one of (or the absance of): .male .female .maleFemale
    * Race from one of (or absance of): .unicorn .pegasus .alicorn .earthPony
    * If .changeling is also present then it is a changeling too
    * The points given from the goal from one of: .s0 .s1 .s2 .s3
 * imgstrip: This is a strip of the 60 left most pixels of the card art, the part which can be covered by icons. The remaining card art can be extracted from the image its self.

# Task progress

Approximate time with various distractions:

1.19pm - 6.34pm (5h 15m)
7.16pm - 9.49pm (2h 33m)


## Improvements

If I were doing it again:
* I wouldn't waste time trying to style the link to the right of the "Logs" heading, moving it around and trying to get
  it to look good on different screen sizes.
* I might have tried looking at one of my TWBS 3 projects to remind myself of the useful bits of TWBS.
* I wouldn't use the ngStorage library. It is popular, tries to do some things nicely and I can see the attraction.
  Perhaps for a different project where the requirements are different. Here I wanted it to fit in similarly to how I
  would interact with most data stores eg with some getter-setter methods. After trying it, I see that it has a couple
  of quirks that weren't immediately obvious from quickly looking at the README.
* Add a protractor test or 2.

It was a bit annoying that it took a bit of fixing to get the responsive menu to work well.

I like the way that I handled the urls for paying/depositing money. Half fill in the form and then switch types to see.


## Done

1. You can choose the currency of the wallet, this should be displayed next to each item and the 
grand total.
2. For the currency symbol next the grand total you should use a [font­awesome][font­awesome] icon and for 
the items in the wallet it should be text.
3. The javascript logic should be built on angular.js
4. At least one Angular.js directive should be used.
5. The input’s to add/remove amounts should have error checking and reporting.
6. The wallet data should persist on a page refresh for the same user until they click “Reset” in 
the menu. It is up to the developer to choose persistence method.
7. The code should be hosted in a Git repository, ideally we would like to see how you got to the 
end result via a series of commits as opposed to one large commit.
8. The menu should have menu items horizontally and collapse on mobile devices into a 
responsive menu. As an example of the layout and resize behaviour, view the font­awesome 
website in your browser to view the menu collapse effect.
9. The wallet can never contain a negative amount.
10. The method of adding/removing values to a wallet can be via separate inputs or a single 
combined input with a select box for add/remove.
11. There is no limit to the amount of values added or removed in the wallet.


## Awaiting development

Nothing

[font­awesome]: http://fortawesome.github.io/Font­Awesome/

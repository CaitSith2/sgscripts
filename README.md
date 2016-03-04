# sgscripts
My Userscripts for Steamgifts.com

Suggestions? Go to the discussion thread @Steamgifts.com
http://www.steamgifts.com/discussion/SQ56V/

## sgtags.users.js
Ever had the situation where you see a giveaway but you are not sure if you like that game at all or not? 
Do you first look at the tags of a game before deciding if you will like it or not?

I implemented a small user script. It adds the tags from steam store page on the giveaway heading behind the steam link. Data is provided by my own steam-api proxy for caching purpose (steam api limits access) and because steamapi doesn't support cross orgin policy

If I think my server can't handle enough traffic I will shut down the Proxy and the script will no longer be usable.

## sgblock.user.js
The purpose of this script is very simple. Many games are blocked because I either don't want that game or I already have it, but it is not recognized by the steam api. Examples are GOTY editions and DLCs.

This script changes the text and representation of the join button. It turns from green to red. You can still use the button to enter the giveaway in any case we have a false positive.

The script checks your filtered giveaway list.

## sggrouphiding.user.js
I often browse the group pages of my groups I am in. But what I don't want to see there are giveaways for games I already have or I don't want to enter anyways. The script removes all giveaways that exist in your account or are on your blocking list

## sggroupidentifier.user.js
Shows the groups eligable for the giveaway in giveaway list. You have be able to visit the giveaway page to see the information.

## sgblockgiveawaybutton.user.js
This is the script you were waiting for. Hide a game from within its giveaway page.

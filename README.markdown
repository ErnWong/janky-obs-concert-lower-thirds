# A jank way to show programme items as lower thirds for a concert that you are live streaming in OBS that works across scenes, so you can switch between your gazillion cameras independently from the lower third if you are doing a multicam setup.

This gives you a control panel webpage you can use to switch between which programme item is being played.

Bonus feature (which comes with bonus bugs): you can set how long a programme item is expected to be, and the control panel will display a colourful timer that will remind you to change to the next programme item when the time comes.

## How do I use it?

Just run `yarn run start`, open your browser to http://localhost:8080/control.html, and embed http://localhost:8080/index.html into your OBS scenes. Change `./programme.toml` to suit your needs.

## How does it look like?

https://youtu.be/ojUR1oQXxdk

## Is it reliable?

No. Don't rely on it :)

This is provided as is.

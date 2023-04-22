function descriptor()
	return {
		title = "Randomize Playlist",
		version = "1.1.2",
		shortdesc = "Randomize Playlist",
		description = "Shuffles all items on the playlist similar to MPC-HC's randomize playlist function.",
		author = "Daniel Grünwald",
		icon = [[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
		<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path stroke="none" fill="#33333f" d="M 18.3125,23 22,23.03125 22,27 28,21 22,15 22,19.03125 19.6875,19 7.6875,10 2,10 2,14 6.34375,14 z M 15.361844,14.403932 16.53125,10 24,10 24,14 30,8 24,2 24,6 13.46875,6 11.908809,11.764408 z M 10.212023,18.207792 8.9375,23 0,23 l 0,4 12.03125,0 1.651047,-6.199744 z"/></svg>]],
		capabilities = {"trigger"}
	}
end

function trigger()
	vlc.playlist.stop()
	
	math.randomseed(os.time())
	
	local pl = vlc.playlist.get("normal", false)
	local randomList = {}
	
	for i, v in ipairs(pl.children) do
		if v.duration == -1 then v.duration = 0 end
		randomList[#randomList + 1] = v
	end
	
	local swap
	for i = 1, #randomList do 
		swap = math.random(i, #randomList)
		randomList[i], randomList[swap] = randomList[swap], randomList[i]
	end
	
	vlc.playlist.clear()
	vlc.playlist.enqueue(randomList)
	
	vlc.msg.info("Playlist shuffled!")
end
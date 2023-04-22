--[[
VLC Playing Extension for VLC media player
Copyright 2015 ManiacMouse

Authors: ManiacMouse
Contact: vlcplaying@maniacmouse.eu

Information:
Can be used together with any software that can read input from a
text file, for example OBS (Open Broadcaster Software) which was my
use case when implementing this extension.

License:
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
--]]

-- Descriptor
function descriptor()
  return {
    title = "VLC Playing 0.1.1",
    version = "0.1.1",
    author = "ManiacMouse",
    url = "",
    shortdesc = "VLC Playing",
    description = "Saves the artist and title of currently playing song to <UserDataDirectory>\VLCPlaying.txt",
    capabilities = { "input-listener" }
  }
end

-- Activate, Close & Deactivate
function activate()
  vlc.msg.dbg("[VLC Playing] Activate!")
  update_track()
end
function close()
  clear_file()
  vlc.msg.dbg("[VLC Playing] Close!")
end
function deactivate()
  clear_file()
  vlc.msg.dbg("[VLC Playing] Deactivate!")
end

-- Triggers
function input_changed()
  vlc.msg.dbg("[VLC Playing] Input Change!")
  update_track() 
end
function meta_changed()
  return false
end

-- Update Track
function update_track()
  vlc.msg.dbg("[VLC Playing] Update Track!")
  if vlc.input.is_playing() then
    local item = vlc.item or vlc.input.item()
    if item then
      local meta = item:metas()
      if meta then
        local artist = meta["artist"]
        if not artist then
          artist = "Unknown Artist"
        end
        local title = meta["title"]
        if not title then
          title = "Unknown Title"
        end
        write_file(artist, title)
        return true
      end
    end
  end
  clear_file()
end

-- Clear File
function clear_file()
  vlc.msg.dbg("[VLC Playing] Clear File!")
  local VLCPlayingFile = vlc.config.userdatadir() .. "/VLCPlaying.txt"
  local file = io.open(VLCPlayingFile, "w+")
  file:write("")
  file:close()
end

-- Write File
function write_file(artist, title)
  vlc.msg.dbg("[VLC Playing] Write File!")
  local VLCPlayingFile = vlc.config.userdatadir() .. "/VLCPlaying.txt"
  local file = io.open(VLCPlayingFile, "w+")
  file:write(artist .. " - " .. title)
  file:close()
end

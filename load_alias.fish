#!/bin/fish
function snpm
    snap run node.npm $argv
end

function snpx
    snap run node.npx $argv
end

function snode
    snap run node $argv
end


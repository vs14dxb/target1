<?php

$directory = __DIR__ . '/../assets/images/catalog';
$sources = array_merge(glob($directory . '/*.png'), glob(__DIR__ . '/../assets/images/*.png'));

foreach ($sources as $source) {
    $image = imagecreatefrompng($source);
    if ($image === false) {
        throw new RuntimeException("Unable to read {$source}");
    }
    $width = imagesx($image);
    $height = imagesy($image);
    $largeBanners = ['hero-banner.png', 'paint-hero.png', 'paint-hero-v2.png', 'trade-counter-v2.png', 'bulk-supply-v2.png'];
    $maxEdge = in_array(basename($source), $largeBanners, true) ? 1800 : 1000;
    $scale = min(1, $maxEdge / max($width, $height));
    $resized = imagescale($image, (int) round($width * $scale), (int) round($height * $scale), IMG_BICUBIC_FIXED);
    $destination = preg_replace('/\.png$/i', '.webp', $source);
    if ($resized === false || !imagewebp($resized, $destination, 84)) {
        throw new RuntimeException("Unable to write {$destination}");
    }
    imagedestroy($image);
    imagedestroy($resized);
    echo basename($destination) . PHP_EOL;
}

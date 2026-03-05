#!/usr/bin/env python3
"""
HashCii Desktop Shortcut Creator
Creates a desktop shortcut/icon for Windows, macOS, and Linux.

Usage:
    python create_shortcut.py
"""

import os
import platform
import shutil
import struct
import subprocess
import sys
import zlib
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
ASSETS_DIR = PROJECT_ROOT / "assets"
ICON_NAME = "hashcii"


# ──────────────────────────── Icon Generation ────────────────────────────


def _generate_icon_pixels(size: int) -> bytes:
    """Generate a simple HashCii icon as RGBA pixel data."""
    pixels = bytearray()
    center = size / 2
    radius = size * 0.44
    corner_r = size * 0.19  # rounded-rect corner radius

    bg_r, bg_g, bg_b = 99, 102, 241   # indigo accent
    fg_r, fg_g, fg_b = 255, 255, 255  # white

    for y in range(size):
        for x in range(size):
            # Rounded rectangle check
            nx = x - center + 0.5
            ny = y - center + 0.5
            half = radius
            inside = True

            if abs(nx) > half or abs(ny) > half:
                inside = False
            else:
                cx = max(abs(nx) - (half - corner_r), 0)
                cy = max(abs(ny) - (half - corner_r), 0)
                if cx * cx + cy * cy > corner_r * corner_r:
                    inside = False

            if inside:
                # Draw '#' symbol
                rel_x = nx / half
                rel_y = ny / half

                draw_fg = False
                # Two vertical bars
                if (-0.35 <= rel_x <= -0.15 or 0.15 <= rel_x <= 0.35) and -0.55 <= rel_y <= 0.55:
                    draw_fg = True
                # Two horizontal bars
                if -0.55 <= rel_x <= 0.55 and (-0.28 <= rel_y <= -0.08 or 0.08 <= rel_y <= 0.28):
                    draw_fg = True

                if draw_fg:
                    pixels.extend([fg_r, fg_g, fg_b, 255])
                else:
                    pixels.extend([bg_r, bg_g, bg_b, 255])
            else:
                pixels.extend([0, 0, 0, 0])

    return bytes(pixels)


def _create_png(width: int, height: int, pixels: bytes) -> bytes:
    """Create a PNG file from RGBA pixel data."""

    def _chunk(chunk_type: bytes, data: bytes) -> bytes:
        c = chunk_type + data
        crc = struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack(">I", len(data)) + c + crc

    signature = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)

    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter: None
        offset = y * width * 4
        raw.extend(pixels[offset : offset + width * 4])

    compressed = zlib.compress(bytes(raw), 9)

    return (
        signature
        + _chunk(b"IHDR", ihdr)
        + _chunk(b"IDAT", compressed)
        + _chunk(b"IEND", b"")
    )


def create_ico(path: Path, sizes: tuple = (16, 32, 48, 256)) -> None:
    """Create an ICO file containing multiple resolutions."""
    images = []
    for s in sizes:
        px = _generate_icon_pixels(s)
        images.append((s, _create_png(s, s, px)))

    header = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries = b""
    data = b""

    for s, png in images:
        w = s if s < 256 else 0
        h = s if s < 256 else 0
        entries += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(png), offset)
        data += png
        offset += len(png)

    path.write_bytes(header + entries + data)
    print(f"  [OK] {path}")


def create_png_icon(path: Path, size: int = 256) -> None:
    """Create a PNG icon file."""
    px = _generate_icon_pixels(size)
    path.write_bytes(_create_png(size, size, px))
    print(f"  [OK] {path}")


def ensure_icons() -> tuple:
    """Generate all icon assets in the assets/ directory."""
    ASSETS_DIR.mkdir(exist_ok=True)

    ico = ASSETS_DIR / f"{ICON_NAME}.ico"
    png = ASSETS_DIR / f"{ICON_NAME}.png"

    if not ico.exists():
        create_ico(ico)
    if not png.exists():
        create_png_icon(png)

    svg = ASSETS_DIR / f"{ICON_NAME}.svg"  # already shipped with repo
    return ico, png, svg


# ──────────────────────────── Desktop Path ────────────────────────────


def _desktop_path() -> Path:
    system = platform.system()
    if system == "Windows":
        try:
            import ctypes
            import ctypes.wintypes
            buf = ctypes.create_unicode_buffer(ctypes.wintypes.MAX_PATH)
            # CSIDL_DESKTOPDIRECTORY = 0x0010
            ctypes.windll.shell32.SHGetFolderPathW(None, 0x0010, None, 0, buf)
            if buf.value:
                return Path(buf.value)
        except Exception:
            pass
        return Path(os.path.expandvars(r"%USERPROFILE%\Desktop"))
    if system == "Darwin":
        return Path.home() / "Desktop"
    try:
        result = subprocess.run(
            ["xdg-user-dir", "DESKTOP"], capture_output=True, text=True
        )
        if result.returncode == 0 and result.stdout.strip():
            return Path(result.stdout.strip())
    except FileNotFoundError:
        pass
    return Path.home() / "Desktop"


# ──────────────────────────── Windows ────────────────────────────


def _create_windows_shortcut(ico_path: Path) -> bool:
    desktop = _desktop_path()
    shortcut = desktop / "HashCii.lnk"
    vbs_path = PROJECT_ROOT / "start_hidden.vbs"
    target = str(vbs_path) if vbs_path.exists() else str(PROJECT_ROOT / "start.bat")

    ps = (
        '$ws = New-Object -ComObject WScript.Shell; '
        f'$sc = $ws.CreateShortcut("{shortcut}"); '
        f'$sc.TargetPath = "wscript.exe"; '
        f'$sc.Arguments = """{target}"""; '
        f'$sc.WorkingDirectory = "{PROJECT_ROOT}"; '
        f'$sc.IconLocation = "{ico_path}, 0"; '
        '$sc.Description = "HashCii - Cryptographic Utility Suite"; '
        '$sc.WindowStyle = 7; '
        '$sc.Save()'
    )

    r = subprocess.run(
        ["powershell", "-NoProfile", "-Command", ps],
        capture_output=True, text=True,
    )
    if r.returncode == 0:
        print(f"  [OK] Desktop shortcut created: {shortcut}")
        return True
    print(f"  [ERROR] {r.stderr.strip()}")
    return False


# ──────────────────────────── macOS ────────────────────────────


def _create_macos_app(png_path: Path) -> bool:
    desktop = _desktop_path()
    app = desktop / "HashCii.app"
    macos_dir = app / "Contents" / "MacOS"
    res_dir = app / "Contents" / "Resources"

    macos_dir.mkdir(parents=True, exist_ok=True)
    res_dir.mkdir(parents=True, exist_ok=True)

    # Info.plist
    plist = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"'
        ' "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
        '<plist version="1.0"><dict>\n'
        "  <key>CFBundleName</key><string>HashCii</string>\n"
        "  <key>CFBundleDisplayName</key><string>HashCii</string>\n"
        "  <key>CFBundleIdentifier</key><string>com.hashcii.app</string>\n"
        "  <key>CFBundleVersion</key><string>1.0.0</string>\n"
        "  <key>CFBundleExecutable</key><string>launch</string>\n"
        "  <key>CFBundleIconFile</key><string>icon.png</string>\n"
        "  <key>LSMinimumSystemVersion</key><string>10.13</string>\n"
        "</dict></plist>"
    )
    (app / "Contents" / "Info.plist").write_text(plist)

    # Launcher script
    launcher = (
        "#!/bin/bash\n"
        f'cd "{PROJECT_ROOT}"\n'
        "./start.sh\n"
    )
    launch_file = macos_dir / "launch"
    launch_file.write_text(launcher)
    os.chmod(str(launch_file), 0o755)

    # Icon
    shutil.copy2(str(png_path), str(res_dir / "icon.png"))

    print(f"  [OK] macOS app bundle created: {app}")
    return True


# ──────────────────────────── Linux ────────────────────────────


def _create_linux_desktop(png_path: Path) -> bool:
    desktop = _desktop_path()

    # Install icon
    icon_dest = Path.home() / ".local" / "share" / "icons" / "hashcii.png"
    icon_dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(str(png_path), str(icon_dest))

    entry = (
        "[Desktop Entry]\n"
        "Name=HashCii\n"
        "Comment=Cryptographic Utility Suite\n"
        f"Exec=bash -c \"cd '{PROJECT_ROOT}' && ./start.sh\"\n"
        f"Icon={icon_dest}\n"
        "Terminal=false\n"
        "Type=Application\n"
        "Categories=Utility;Security;\n"
        "StartupNotify=true\n"
    )

    # Desktop shortcut
    dt_file = desktop / "HashCii.desktop"
    dt_file.write_text(entry)
    os.chmod(str(dt_file), 0o755)

    # Try to mark trusted on GNOME
    try:
        subprocess.run(
            ["gio", "set", str(dt_file), "metadata::trusted", "true"],
            capture_output=True,
        )
    except FileNotFoundError:
        pass

    # Application menu entry
    apps_dir = Path.home() / ".local" / "share" / "applications"
    apps_dir.mkdir(parents=True, exist_ok=True)
    (apps_dir / "hashcii.desktop").write_text(entry)

    print(f"  [OK] Desktop entry: {dt_file}")
    print(f"  [OK] Menu entry:    {apps_dir / 'hashcii.desktop'}")
    return True


# ──────────────────────────── Main ────────────────────────────


def main() -> int:
    print()
    print("=" * 52)
    print("   HashCii — Desktop Shortcut Creator")
    print("=" * 52)

    system = platform.system()
    print(f"\n  OS       : {system}")
    print(f"  Project  : {PROJECT_ROOT}\n")

    # Step 1 — icons
    print("[1/2] Generating icon assets ...")
    ico_path, png_path, _ = ensure_icons()

    # Step 2 — shortcut
    print("\n[2/2] Creating desktop shortcut ...")
    if system == "Windows":
        ok = _create_windows_shortcut(ico_path)
    elif system == "Darwin":
        ok = _create_macos_app(png_path)
    elif system == "Linux":
        ok = _create_linux_desktop(png_path)
    else:
        print(f"  [ERROR] Unsupported OS: {system}")
        return 1

    print()
    if ok:
        print("  Done!  A HashCii shortcut is now on your desktop.")
        print("  Click it to launch the app in your preferred browser.")
        print()
        print("  Tip: Change the default browser from inside the app")
        print("       using the gear icon in the navigation bar.")
    else:
        print("  [ERROR] Shortcut creation failed.")
        return 1

    print()
    print("=" * 52)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

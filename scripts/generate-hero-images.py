"""Gera 3 imagens premium do Faturamais via ChatGPT (Chrome CDP 9223). 60s entre prompts."""
import asyncio, os
from playwright.async_api import async_playwright
from PIL import Image

ROOT = r"C:\PROJETOS\EXPOSTACKER\sistema-faturamento-saas"
OUT_DIR = os.path.join(ROOT, "public", "images", "hero")
CDP_PORT = 9223
DELAY = 60

IMAGES = [
    ("hero", "Create a premium futuristic fintech SaaS hero background for a Brazilian financial management platform called Faturamais. Sophisticated abstract financial data architecture, translucent glass layers, subtle teal and emerald light, precise geometric connections, elegant depth, dark navy-to-deep-teal environment, premium enterprise software aesthetic, realistic 3D rendering, restrained cinematic lighting, extremely clean composition, generous negative space on the left for HTML headline and CTA, visual interest concentrated on the right. No people, no money bills, no coins, no generic robots, no fake dashboard, no text, no logos, no watermark. Ultra-high resolution, wide 16:9 composition."),
    ("workflow", "Create a sophisticated abstract 3D visualization of an integrated financial workflow for an enterprise SaaS platform. Seven elegant connected stages represented by minimal geometric modules, flowing from sales to orders, invoicing, billing, receiving, reconciliation and financial results. Subtle teal and emerald accents, premium glass and brushed-metal materials, precise lighting, clean white-to-light-gray background, modern fintech visual language, balanced horizontal composition, no text, no labels, no logos, no currency symbols, no watermark. High-resolution 16:9."),
    ("analytics", "Create a premium abstract fintech analytics visual for a modern SaaS financial platform. Elegant translucent data planes, subtle flowing chart-like geometry, precise grid structure, restrained teal and emerald highlights, dark navy background, sophisticated enterprise technology aesthetic, realistic 3D materials, clean composition, no readable numbers, no fake financial claims, no text, no logos, no watermark. High-resolution 4:3."),
]

async def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    async with async_playwright() as p:
        browser = None
        for attempt in range(5):
            try:
                browser = await p.chromium.connect_over_cdp(f"http://localhost:{CDP_PORT}")
                break
            except Exception as e:
                print(f"CDP falhou (tentativa {attempt+1}): {str(e)[:60]}", flush=True)
                await asyncio.sleep(15)
        if not browser:
            raise Exception("Nao conectou ao CDP")

        context = browser.contexts[0]
        page = context.pages[0]
        await page.bring_to_front()

        print("Abrindo ChatGPT...", flush=True)
        await page.goto("https://chatgpt.com/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(10)

        total = 0
        for i, (slug, prompt) in enumerate(IMAGES):
            print(f"\n[{i+1}/{len(IMAGES)}] Gerando: {slug}.png", flush=True)

            try:
                textarea = await page.query_selector('div[contenteditable="true"]')
                if not textarea:
                    textarea = await page.query_selector('textarea#prompt-textarea')
                if not textarea:
                    textarea = await page.query_selector('textarea')

                if not textarea:
                    print("  Textarea nao encontrado!", flush=True)
                    continue

                await textarea.fill(prompt)
                await asyncio.sleep(1)
                await page.keyboard.press("Enter")
                print(f"  Prompt enviado. Aguardando {DELAY}s...", flush=True)
                await asyncio.sleep(DELAY)

                img_data = await page.evaluate(r"""() => {
                    let results = [];
                    document.querySelectorAll('img').forEach(img => {
                        let src = img.src || img.getAttribute('data-src') || '';
                        if (src && src.startsWith('http') && src.length > 50) {
                            let w = img.naturalWidth || img.width || 0;
                            let h = img.naturalHeight || img.height || 0;
                            results.push({src, w, h});
                        }
                    });
                    return results;
                }""")

                download_urls = []
                for d in img_data:
                    src = d["src"]
                    if any(x in src for x in ['oaiusercontent', 'files.oai', 'prod-files', 'dalle', 's3.amazonaws.com/oai', 'oai-dalle', 'generated-image']):
                        download_urls.append(src)
                    elif d["w"] > 200 and d["h"] > 200 and 'avatar' not in src.lower() and 'emoji' not in src.lower():
                        download_urls.append(src)

                download_urls = list(dict.fromkeys(download_urls))

                if download_urls:
                    src = download_urls[-1]
                    try:
                        resp = await page.request.fetch(src, timeout=120000)
                        body = await resp.body()

                        if len(body) > 5000:
                            png_path = os.path.join(OUT_DIR, f"{slug}.png")
                            with open(png_path, 'wb') as f:
                                f.write(body)
                            print(f"  OK: {slug}.png ({len(body)//1024}KB)", flush=True)

                            # WebP otimizado
                            webp_path = os.path.join(OUT_DIR, f"{slug}.webp")
                            with Image.open(png_path) as im:
                                im.save(webp_path, 'WEBP', quality=85, method=6)
                            print(f"  OK: {slug}.webp", flush=True)
                            total += 1
                        else:
                            print(f"  Imagem muito pequena ({len(body)}B)", flush=True)
                    except Exception as e:
                        print(f"  Erro baixar: {str(e)[:80]}", flush=True)
                else:
                    print("  Nenhuma imagem gerada", flush=True)

            except Exception as e:
                print(f"  Erro: {str(e)[:80]}", flush=True)

            if i < len(IMAGES) - 1:
                await asyncio.sleep(10)

        print(f"\n{'='*60}", flush=True)
        print(f"TOTAL: {total} imagens geradas", flush=True)
        for f in sorted(os.listdir(OUT_DIR)):
            fpath = os.path.join(OUT_DIR, f)
            size = os.path.getsize(fpath) // 1024
            print(f"  {f} ({size}KB)", flush=True)

        await browser.close()

asyncio.run(main())

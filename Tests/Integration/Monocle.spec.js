describe('Sitegeist.Monocle UI', () => {
    it('should initially display the first available fusion prototype', async () => {
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(500);

        await expect(page.title()).resolves.toMatch('Monocle: Foo');
    });

    it('should allow to navigate to any other available fusion prototype', async () => {
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(500);

        const [searchButton] = await page.$x('//header//button[contains(., \'Foo\')]');
        await searchButton.click();
        await page.waitForTimeout(300);

        const [prototypeButton] = await page.$x('//header//button//div[contains(., \'Vendor.Site:Component.Bar\')]');
        await prototypeButton.click();

        await expect(page.title()).resolves.toMatch('Monocle: Bar');
    });

    it('should allow to search for available fusion prototypes', async () => {
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(500);

        const [searchButton] = await page.$x('//header//button[contains(., \'Foo\')]');
        await searchButton.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'toast.jpg' });
        expect((await page.$x('//header//button//div[contains(., \'Vendor.Site:Component\')]')).length).toBe(2);

        const [searchInput] = await page.$x('//header//input');
        await searchInput.type('Bar');

        expect((await page.$x('//header//button//div[contains(., \'Vendor.Site:Component\')]')).length).toBe(1);
        expect((await page.$x('//header//button//div[contains(., \'Vendor.Site:Component.Bar\')]')).length).toBe(1);
    });
});

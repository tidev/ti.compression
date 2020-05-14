let Compression;

const IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');
const ANDROID = Ti.Platform.name === 'android';

describe('ti.compression', () => {
	it('can be required', () => {
		Compression = require('ti.compression');

		expect(Compression).toBeDefined();
	});

	it('.apiName', () => {
		expect(Compression.apiName).toBe('Ti.Compression');
	});

	describe('methods', () => {
		describe('#unzip()', () => {
			it('#is a Function', () => {
				expect(Compression.unzip).toEqual(jasmine.any(Function));
			});

			it('can unzip a file', () => {
				const zipFileName = Ti.Filesystem.resourcesDirectory + 'ab.zip';
				const dataFolder = Ti.Filesystem.applicationDataDirectory + 'data';
				const result = Compression.unzip(
					dataFolder,
					zipFileName,
					true
				);

				expect(result).toEqual('success');

				const aTxt = Ti.Filesystem.getFile(dataFolder, 'a.txt');
				const bTxt = Ti.Filesystem.getFile(dataFolder, 'b.txt');

				expect(aTxt.exists()).toBeTrue();
				expect(aTxt.size).toEqual(44);
				expect(bTxt.exists()).toBeTrue();
				expect(bTxt.size).toEqual(95);
			});
		});

		describe('#zip()', () => {
			// eslint-disable-next-line jasmine/no-spec-dupes
			it('#is a Function', () => {
				expect(Compression.zip).toEqual(jasmine.any(Function));
			});

			it('can zip a file', () => {
				// initial sanity check to verify the input files exist
				const aTxt = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/a.txt');
				const bTxt = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/b.txt');

				expect(aTxt.exists()).toBeTrue();
				expect(bTxt.exists()).toBeTrue();

				const zipFileName = Ti.Filesystem.applicationDataDirectory + '/test.zip';
				const result = Compression.zip(
					zipFileName,
					[
						Ti.Filesystem.resourcesDirectory + '/a.txt',
						Ti.Filesystem.resourcesDirectory + '/b.txt',
					]
				);

				expect(result).toEqual('success');

				// make sure the output file exists
				const file = Ti.Filesystem.getFile(zipFileName);
				const zipFileSize = IOS ? 324 : 356;

				expect(file.exists()).toBeTrue();
				expect(file.size).toEqual(zipFileSize);
			});

			describe('##zip() with invalid values', () => {

				it('fails on invalid zip file destination', () => {
					var result = Compression.zip('', [ Ti.Filesystem.resourcesDirectory + '/a.txt' ]);

					expect(result).not.toEqual('success');
				});

				if (ANDROID) {
					it('fails on no file to zip input', () => {
						var result = Compression.zip(Ti.Filesystem.applicationDataDirectory + '/test.zip', [ '' ]);

						expect(result).not.toEqual('success');
					});
				}

			});

			describe('##unzip() with invalid values', () => {

				it('fails on invalid zip file input', () => {
					var result = Compression.unzip(Ti.Filesystem.applicationDataDirectory + 'data',	'',	true);

					expect(result).not.toEqual('success');
				});

				if (ANDROID) {
					it('fails on invalid unzip destination', () => {
						var result = Compression.unzip(null, Ti.Filesystem.applicationDataDirectory + '/test.zip', true);

						expect(result).not.toEqual('success');
					});
					it('fails on overwrite not provided', () => {
						var result = Compression.unzip(null, Ti.Filesystem.applicationDataDirectory + '/test.zip');

						expect(result).not.toEqual('success');
					});
				}
			});
		});

		describe('#roundtrip zip and unzip', () => {

			const aTxt = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/a.txt');
			const bTxt = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/b.txt');
			const zipFileName = Ti.Filesystem.applicationDataDirectory + '/test.zip';

			const dataFolder = Ti.Filesystem.applicationDataDirectory + 'data';

			it('fize size to be same', () => {

				Compression.zip(zipFileName,
					[
						Ti.Filesystem.resourcesDirectory + '/a.txt',
						Ti.Filesystem.resourcesDirectory + '/b.txt',
					]
				);

				Compression.unzip(
					dataFolder,
					zipFileName,
					true
				);

				let afterUnzipaTxt = Ti.Filesystem.getFile(dataFolder, 'a.txt');
				let afterUnzipbTxt = Ti.Filesystem.getFile(dataFolder, 'b.txt');

				expect(aTxt.size).toEqual(afterUnzipaTxt.size);
				expect(bTxt.size).toEqual(afterUnzipbTxt.size);
			});

			it('compare extracted contents versus initial', () => {

				Compression.zip(zipFileName,
					[
						Ti.Filesystem.resourcesDirectory + '/a.txt',
						Ti.Filesystem.resourcesDirectory + '/b.txt',
					]
				);

				Compression.unzip(
					dataFolder,
					zipFileName,
					true
				);

				let afterUnzipaTxt = Ti.Filesystem.getFile(dataFolder, 'a.txt');
				let afterUnzipbTxt = Ti.Filesystem.getFile(dataFolder, 'b.txt');

				expect(Ti.Utils.md5HexDigest(aTxt.read().text)).toEqual(Ti.Utils.md5HexDigest(afterUnzipaTxt.read().text));
				expect(Ti.Utils.md5HexDigest(bTxt.read().text)).toEqual(Ti.Utils.md5HexDigest(afterUnzipbTxt.read().text));
			});
		});
	});
});

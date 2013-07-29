/**
 * Ti.Compression Module
 * Copyright (c) 2010-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE included with this distribution for details.
 */

package ti.compression;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.LinkedList;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.io.TiBaseFile;
import org.appcelerator.titanium.io.TiFileFactory;

@Kroll.module(name = "Compression", id = "ti.compression")
public class CompressionModule extends KrollModule {

	public CompressionModule() {
		super();
	}

	@Kroll.method
	public String zip(Object[] args) {
		// Check that our arguments are valid.
		if (args.length != 2) {
			return "Invalid number of arguments provided!";
		}

		String rawZip = (String) args[0];
		if (rawZip == null || rawZip.length() == 0) {
			return "archiveFile was not specified or was empty!";
		}
		TiBaseFile zip = TiFileFactory.createTitaniumFile(rawZip,
				false);

		Object[] rawFiles = (Object[]) args[1];
		if (rawFiles == null || rawFiles.length == 0) {
			return "fileArray was not specified or was empty!";
		}
		LinkedList<TiBaseFile> files = new LinkedList<TiBaseFile>();
		for (Object rawFile : rawFiles) {
			files.add(TiFileFactory.createTitaniumFile(rawFile.toString(),
			    false));
		}

		// And then zip the files in to the archive.
		try {
			OutputStream fout = zip.getOutputStream();
			ZipOutputStream zout = new ZipOutputStream(
					new BufferedOutputStream(fout));

			while (!files.isEmpty()) {
				TiBaseFile file = files.remove();
				if (!file.exists()) {
					Util.e("Skipping over file, because it does not exist: "
							+ file.nativePath());
				} else {
					ZipEntry ze = new ZipEntry(file.name());
					zout.putNextEntry(ze);
					writeInFile(file, zout);
					zout.closeEntry();
				}
			}
			zout.close();
			return "success";
		} catch (Exception e) {
			Util.e("Hit exception while unzipping the archive!", e);
			return e.toString();
		}
	}

	@Kroll.method
	public String unzip(Object[] args) {
		// Check that our arguments are valid.
		if (args.length != 3) {
			return "Invalid number of arguments provided!";
		}

		String rawDest = (String) args[0];
		if (rawDest == null || rawDest.length() == 0) {
			return "destinationFolder was not specified or was empty!";
		}
		String destPath = TiFileFactory
				.createTitaniumFile(rawDest, false).getNativeFile()
				.getAbsolutePath();

		String rawZip = (String) args[1];
		if (rawZip == null || rawZip.length() == 0) {
			return "archiveFile was not specified or was empty!";
		}
		TiBaseFile zip = TiFileFactory.createTitaniumFile(rawZip,
				false);
		if (!zip.exists())
			return "archiveFile was not found at " + rawZip + "!";

		Boolean overwrite = (Boolean) args[2];
		if (overwrite == null) {
			return "overwrite was not specified!";
		}

		// And then unzip the archive.
		try {
			InputStream fin = zip.getInputStream();
			ZipInputStream zin = new ZipInputStream(
					new BufferedInputStream(fin));
			ZipEntry ze = null;
			while ((ze = zin.getNextEntry()) != null) {
				String target = destPath + "/" + ze.getName();
				if (ze.isDirectory()) {
					ensureDirectoryExists(target);
				} else {
					File file = new File(target);
					if (overwrite || !file.exists()) {
						writeOutFile(file, target, zin);
					}
				}
			}
			zin.close();
			fin.close();
			return "success";
		} catch (Exception e) {
			Util.e("Hit exception while unzipping the archive!", e);
			return e.toString();
		}
	}

	public void ensureDirectoryExists(String target) {
		File f = new File(target);
		if (!f.isDirectory()) {
			f.mkdirs();
		}
	}

	private void writeInFile(TiBaseFile tifile, ZipOutputStream zout)
			throws IOException {
		int size;
		byte[] buffer = new byte[2048];
		InputStream fos = tifile.getInputStream();
		BufferedInputStream bos = new BufferedInputStream(fos, buffer.length);
		while ((size = bos.read(buffer, 0, buffer.length)) != -1) {
			zout.write(buffer, 0, size);
		}
	}

	private void writeOutFile(File file, String target, ZipInputStream zin)
			throws IOException {
		// Make sure the parent directory exists.
        file.getParentFile().mkdirs();
		// Write out the file.
		int size;
		byte[] buffer = new byte[2048];
		FileOutputStream fos = new FileOutputStream(target);
		BufferedOutputStream bos = new BufferedOutputStream(fos, buffer.length);
		while ((size = zin.read(buffer, 0, buffer.length)) != -1) {
			bos.write(buffer, 0, size);
		}
		bos.flush();
		bos.close();
	}
}

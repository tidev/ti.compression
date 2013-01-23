/**
 * Ti.Compression Module
 * Copyright (c) 2010-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE included with this distribution for details.
 */

package ti.compression;

import org.appcelerator.kroll.common.Log;

/**
 * Holds various static methods that we will use throughout the module.
 * @author Dawson Toth, Appcelerator Inc.
 */
public final class Util {

	/**
	 * Prevents instantiation.
	 */
	private Util() {}
	
	/*
	 * These 8 methods are useful for logging purposes -- they make what we do in this module a tiny bit easier.
	 */
	public static void d(String msg) {
		Log.d(Constants.LCAT, msg);
	}
	public static void d(String msg, Throwable e) {
		Log.d(Constants.LCAT, msg, e);
	}
	
	public static void i(String msg) {
		Log.i(Constants.LCAT, msg);
	}
	public static void i(String msg, Throwable e) {
		Log.i(Constants.LCAT, msg, e);
	}

	public static void w(String msg) {
		Log.w(Constants.LCAT, msg);
	}
	public static void w(String msg, Throwable e) {
		Log.w(Constants.LCAT, msg, e);
	}
	
	public static void e(String msg) {
		Log.e(Constants.LCAT, msg);
	}
	public static void e(String msg, Throwable e) {
		Log.e(Constants.LCAT, msg, e);
	}
}

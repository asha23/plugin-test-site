<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'cookie-test' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'root' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '())MY|VHWxzj9s#n#:*Q+o`g^QN!Kp5,6Fnr/Egt@OHvo2i]w;Suru#Pn1VrM~y<' );
define( 'SECURE_AUTH_KEY',  'r cuSOBvJ-URfz`o1Qn4U<a9k&O?70ICP(BH%O~1BG$G^gj.Ar99X-kE)1(-)b.:' );
define( 'LOGGED_IN_KEY',    'dU*t2AI06YnRog6!v}*t7P=a+G`),BJ3A(;H8`_{i(e17XyU$(eKwuB>%OMdsznN' );
define( 'NONCE_KEY',        'EU%R6;}*Ywbz|I!io@TpGzbC6xs&bg a|%E(&t(O|hNM$i#v475@<AvAve=JOyJ]' );
define( 'AUTH_SALT',        '3$;{:~F|1)=OC%J RZ8HZ:5kL~PEClB+Gc0v5!yF&<Lcz_Uq!Cof65S/yzW|sbuA' );
define( 'SECURE_AUTH_SALT', 'mZBvd}*XP|Lu0mq]Hv4- (R$i3@:t7]$YR,Y=H.6JHZ!/*fxrolY^/SQ8ks[8{p[' );
define( 'LOGGED_IN_SALT',   'J5<YAu8RE1#K}^&U034~!7f<^EZ^ZR?lXU[X$)`ce;n!rhUt8u@`9Zme~i^~~kG2' );
define( 'NONCE_SALT',       'm,:8:U(p;:3D2N-a[.wpz(4T~7yKXOaUx4/~l13|H-O9!s>>TF$bKm$X%ck@o:6_' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

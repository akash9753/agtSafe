import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../settings';

export default ({ collapsed }) => {
    return (
        <div className="isoLogoWrapper">
            {collapsed ? (
                <div>
                    <h3>
                        <Link to="/trans">
                            <i className={siteConfig.siteIcon} />
                        </Link>
                    </h3>
                </div>
            ) : (
                <h3>
                    <Link to="/trans">
                        <img style={{ height: "40px" }} src={require("../../image/TransBot-logos_white.png")} />
                    </Link>
                </h3>
            )}
        </div>
    );
};
